import * as React from 'react'
import { isEqual, cloneDeep } from 'lodash'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import { useQuery } from '@apollo/react-hooks'
import { useEvent } from 'helpers/methods'
import { DocumentNode } from 'graphql'

export interface EdgeType<NodeType> {
  cursor: string
  node: NodeType
  __typename: string
}

/*
This supports two types of queries:
One of this structure:
data {
  connection {
    ...
  }
}
and one of this structure:
data {
  result {
    connection {
      ...
    }
  }
}
*/
export interface QueryConnectionRes<NodeType> {
  connection: {
    pageInfo: {
      hasNextPage: boolean
      __typename: string
    }
    edges: Array<EdgeType<NodeType>>
    __typename: string
  }
  __typename: string
}

export interface QueryResultRes<NodeType> {
  result: QueryConnectionRes<NodeType>
  __typename: string
}

export interface SubscriptionRes<NodeType> {
  result: {
    node: NodeType
    operation: 'CREATE' | 'DELETE'
  }
}

function getQueryDataInit(hasJustConnection: boolean, nodeInit: any) {
  const connectionDataInit: QueryConnectionRes<typeof nodeInit> = {
    connection: {
      pageInfo: {
        hasNextPage: true,
        __typename: '',
      },
      edges: [
        {
          cursor: '',
          node: nodeInit,
          __typename: '',
        },
      ],
      __typename: '',
    },
    __typename: '',
  }

  const resultDataInit: QueryResultRes<typeof nodeInit> = {
    result: connectionDataInit,
    __typename: '',
  }

  if (hasJustConnection) {
    return connectionDataInit
  } else {
    return resultDataInit
  }
}

interface InfiniteScrollProps<NodeType, QueryVarsType> {
  QUERY: DocumentNode
  hasJustConnection: boolean
  nodeInit: NodeType
  QueryVars: QueryVarsType
  children: (edges: Array<EdgeType<NodeType>>) => React.ReactNode
  inModal?: boolean
  hasSubscription?: boolean
  subscriptionRequest?: DocumentNode
}

const InfiniteScroll: React.FC<InfiniteScrollProps<any, any>> = ({
  QUERY,
  hasJustConnection,
  nodeInit,
  QueryVars,
  children,
  inModal,
  hasSubscription,
  subscriptionRequest,
}) => {
  const QueryData = getQueryDataInit(hasJustConnection, nodeInit)
  const {
    loading,
    data,
    error,
    variables,
    fetchMore,
    subscribeToMore,
  } = useQuery<typeof QueryData, typeof QueryVars>(QUERY, {
    client: client,
    errorPolicy: 'all',
    variables: QueryVars,
    fetchPolicy: 'no-cache', // want the contents to be reloaded every time, and never cached
    context: {
      headers: {
        authorization: `Bearer ${getToken()}`,
        'content-type': 'application/json',
      },
    },
  })

  // for keeping track if the variables change
  // ie, sometimes this component will be used by the same query, but with different variables
  // need to be able to detect that the variable has been changed so that data can be refreshed
  const [currQueryVars, setCurrQueryVars] = React.useState(QueryVars)

  const [activelyFetching, setActivelyFetching] = React.useState(false)

  const [isSubscribed, setIsSubscribed] = React.useState(false)

  const [infiniteScrollData, setInfiniteScrollData] = React.useState<
    typeof QueryData
  >(QueryData)

  const [subscriptionEdges, setSubscriptionEdges] = React.useState<
    EdgeType<any>[]
  >([])

  const updateEdges = (newEdges: EdgeType<any>[]) => {
    if ('result' in infiniteScrollData) {
      let combinedData: QueryResultRes<any> = {
        result: {
          connection: {
            pageInfo: infiniteScrollData.result.connection.pageInfo,
            edges: newEdges,
            __typename: infiniteScrollData.result.connection.__typename,
          },
          __typename: infiniteScrollData.result.__typename,
        },
        __typename: infiniteScrollData.__typename,
      }
      setInfiniteScrollData(combinedData)
      return combinedData
    } else if ('connection' in infiniteScrollData) {
      let combinedData: QueryConnectionRes<any> = {
        connection: {
          pageInfo: infiniteScrollData.connection.pageInfo,
          edges: newEdges,
          __typename: infiniteScrollData.connection.__typename,
        },
        __typename: infiniteScrollData.__typename,
      }
      setInfiniteScrollData(combinedData)
      return combinedData
    } else {
      throw "There's something wrong with the return types."
    }
  }

  const onLoadMore = () => {
    setActivelyFetching(true)
    const { result } = (infiniteScrollData as QueryResultRes<any>) || {}
    const { connection } = result || infiniteScrollData
    const { edges } = connection
    const lastCursor = edges[edges.length - 1].cursor
    let newVars = QueryVars
    newVars.cursor = lastCursor
    fetchMore({
      variables: newVars,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          if ('result' in fetchMoreResult && 'result' in infiniteScrollData) {
            const newEdges = [
              ...infiniteScrollData.result.connection.edges,
              ...fetchMoreResult.result.connection.edges,
            ]
            updateEdges(newEdges)
          } else if (
            'connection' in fetchMoreResult &&
            'connection' in infiniteScrollData
          ) {
            const newEdges = [
              ...infiniteScrollData.connection.edges,
              ...fetchMoreResult.connection.edges,
            ]
            updateEdges(newEdges)
          } else {
            throw "There's something wrong with the return types."
          }
        }
        return infiniteScrollData
      },
    })
    setActivelyFetching(false)
  }

  const deleteNodeFromEdges = (edges: EdgeType<any>[], node: any) => {
    console.log('searching for node', node)
    var edgesCopy = cloneDeep(edges)
    for (var i = 0; i < edges.length; i++) {
      console.log('checking node', edges[i].node)
      if (isEqual(edges[i].node, node)) {
        edgesCopy.splice(i, 1)
        return edgesCopy
      }
    }
    return edges // return unchanged edges if node isn't found
  }

  const subscribeToNewData = (subscriptionRequest: DocumentNode) => {
    subscribeToMore<SubscriptionRes<typeof nodeInit>>({
      document: subscriptionRequest,
      variables: {
        userToken: getToken(),
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        // take 'subscriptionData' and append it to the beginning of the edges array
        if (subscriptionData.data.result) {
          if (subscriptionData.data.result.operation == 'CREATE') {
            let newEdge = {
              cursor: Math.random().toString(36).substring(7),
              node: subscriptionData.data.result.node,
              __typename: '',
            }
            if ('result' in prev) {
              newEdge.__typename = prev.result.connection.edges[0].__typename
              const newEdges = [newEdge, ...prev.result.connection.edges]
              const combinedData = updateEdges(newEdges)
              return combinedData
            } else if ('connection' in prev) {
              newEdge.__typename = prev.connection.edges[0].__typename
              const newEdges = [newEdge, ...prev.connection.edges]
              const combinedData = updateEdges(newEdges)
              return combinedData
            } else {
              return prev
            }
          } else if (subscriptionData.data.result.operation == 'DELETE') {
            console.log('delete the node:', subscriptionData.data.result.node)
            const { node: nodeToDelete } = subscriptionData.data.result
            if ('result' in prev) {
              const { result } = prev
              const { connection } = result
              const { edges } = connection
              const newEdges = deleteNodeFromEdges(edges, nodeToDelete)
              const newData = updateEdges(newEdges)
              return newData
            } else if ('connection' in prev) {
              const { connection } = prev
              const { edges } = connection
              const newEdges = deleteNodeFromEdges(edges, nodeToDelete)
              const newData = updateEdges(newEdges)
              return newData
            } else {
              return prev
            }
          } else {
            throw "There's something wrong with the return types."
          }
        } else {
          return infiniteScrollData // initializer - ie, if there is no actual subscription data
        }
      },
    })
  }

  const handleScroll = () => {
    if (
      !activelyFetching &&
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - window.innerHeight
    ) {
      const { result } = (infiniteScrollData as QueryResultRes<any>) || {}
      const { connection } = result || infiniteScrollData
      if (connection.pageInfo.hasNextPage) {
        onLoadMore()
      }
    }
  }

  var modalElm: HTMLElement | null = null
  if (typeof document !== 'undefined') {
    modalElm = document.getElementById('app-modal')
  }

  const handleModalScroll = () => {
    if (
      !activelyFetching &&
      modalElm &&
      modalElm.scrollTop + modalElm.clientHeight >= modalElm.scrollHeight
    ) {
      onLoadMore()
    }
  }

  if (inModal && modalElm) {
    useEvent('scroll', handleModalScroll, false, modalElm)
  } else {
    useEvent('scroll', handleScroll, false)
  }

  // for initial load
  const [loaded, setLoad] = React.useState(false)
  if (loaded === false && data) {
    setInfiniteScrollData(data)
    setLoad(true)
  }
  if (QueryVars != currQueryVars) {
    if (data && !loading) {
      setCurrQueryVars(QueryVars)
      setInfiniteScrollData(data)
    }
  }

  // for subscriptions, if applicable
  if (loaded && hasSubscription && subscriptionRequest && !isSubscribed) {
    setIsSubscribed(true)
    subscribeToNewData(subscriptionRequest)
  }

  const { result } = (infiniteScrollData as QueryResultRes<any>) || {}
  console.log('infiniteScrollData:', infiniteScrollData)
  const { connection } = result || infiniteScrollData
  const { edges, pageInfo } = connection
  const { hasNextPage } = pageInfo

  if (error) {
    console.log(error)
  }
  return (
    <React.Fragment>
      <div id="_infinitescroll">
        {children(edges)}
        {/* {!hasNextPage ? (
          <span className="block text-center text-gray-400 py-5">
            loaded all data
          </span>
        ) : null} */}
      </div>
    </React.Fragment>
  )
}

export default InfiniteScroll
