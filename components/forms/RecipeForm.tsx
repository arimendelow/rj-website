import * as React from 'react'
import { GraphQLError } from 'graphql'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import {
  RecipeInputType,
  RecipeInputStepType,
  CreateRecipeVars,
} from '../../requests/recipes'

//start GLOBAL VARIABLES
const IMAGE = require('../../images/icons/add.svg')
const TIME = require('../../images/icons/time.svg')
const CUTLERY = require('../../images/icons/cutlery.svg')

const ingredients = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Coffee' },
  { name: 'Flour' },
  { name: 'Rice' },
]
const units = [
  { name: 'Pound' },
  { name: 'Cup' },
  { name: 'Pinch' },
  { name: 'Tablespoon' },
  { name: 'Whole' },
]
//end GLOBAL VARIABLES

//start INTERFACES
interface Error {
  key: string
  error: string
  message: string
}

interface RecipeFormProps {
  recipeInit?: RecipeInputType
  stepInit?: number
  reviewModeInit?: boolean
  errorsInit?: Array<any>
  submit: (attributes: CreateRecipeVars) => void
}
//end INTERFACES

//start HELPER FUNCTIONS

const NewIngredient = () => ({
  id: Date.now().toString(),
  name: '',
  quantity: '',
  unit: '',
})

const NewStep = () => ({
  stepTitle: '',
  ingredients: [],
  customInfo: '',
})

const NewRecipe = () => ({
  title: '',
  description: '',
  servings: '',
  time: { hours: 0, minutes: 0 },
  steps: [NewStep()],
})

const NewError = (
  key: string,
  error: string,
  message: string,
  step: number
) => ({
  key: key,
  error: error,
  message: message,
  step: step,
})
//end HELPER FUNCTIONS

//start HELPER COMPONENTS
const ErrorField = ({
  name,
  errors,
}: {
  name: string
  errors: Array<Error>
}) => {
  const error = errors.filter((err) => err.key === name)[0]
  return error ? (
    <div className="border-red-600 border">
      <span className="text-left text-sm text-red-600">{error.message}</span>
    </div>
  ) : (
    <React.Fragment />
  )
}

const DeleteX = ({
  onClick,
  title,
  className,
}: {
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void
  title?: string
  className?: string
}) => {
  return (
    <svg
      onClick={onClick}
      className={
        (className || '') +
        ' text-gray-200 hover:text-pink-300 fill-current mx-auto h-6 w-6 '
      }
      role="button"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <title>{title || 'Delete'}</title>
      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
    </svg>
  )
}

const StepMiniView = ({
  recipe,
  stepIndex,
  onClick,
}: {
  recipe: RecipeInputType
  stepIndex: number
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}) => {
  return (
    <div className=" w-10/12 my-2 cursor-pointer p-2 " onClick={onClick}>
      <div className="grid grid-cols-5 bg-gray-200 text-xl p-4 rounded-lg shadow-s">
        <span className=" text-2xl rounded-full text-center m-auto">
          {stepIndex + 1}
        </span>
        <span className="col-span-2 bg-white text-center rounded m-1">
          {recipe.steps[stepIndex].stepTitle}{' '}
        </span>

        <span className="col-span-2 bg-white text-center rounded  m-1">
          {recipe.steps[stepIndex].ingredients.map(
            (ing) =>
              (recipe.steps[stepIndex].ingredients.indexOf(ing) > 0
                ? ', '
                : '') + ing.name
          )}
        </span>
      </div>
    </div>
  )
}
interface RecipeStepProps {
  recipe: RecipeInputType
  step: number
  updateRecipe: (updatedRecipe: RecipeInputType) => void
  getError: (key: string) => Array<Error>
  updateError: (key: string, value?: string | number) => void
  deleteError: (key: string) => void
}

const RecipeStepMode: React.FC<RecipeStepProps> = ({
  recipe,
  updateRecipe,
  step,
  getError,
  updateError,
  deleteError,
}) => {
  const currentStep = step

  const updateValue = (name: string, value: string | number, id?: string) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let index = -1
    switch (name) {
      //modified field is part of ingredient
      case 'name':
      case 'unit':
      case 'quantity':
        index = recipeCopy.steps[currentStep].ingredients.indexOf(
          recipeCopy.steps[currentStep].ingredients.filter(
            (ing: { id: string }) =>
              id && ing.id === id.substring(0, id.indexOf('-'))
          )[0]
        )
        if (index > -1)
          recipeCopy.steps[currentStep].ingredients[index][name] = value
        break
      default:
        recipeCopy.steps[currentStep][name] = value
        break
    }
    updateRecipe(recipeCopy)
    updateError(id || name, value)
  }

  const createIngredient = () => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    recipeCopy.steps[currentStep].ingredients.push(NewIngredient())
    updateRecipe(recipeCopy)
  }

  const deleteIngredient = (ingredientId: string) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let toDelete = recipeCopy.steps[currentStep].ingredients.filter(
      (ing: { id: string }) => ing.id == ingredientId
    )[0]
    let index = recipeCopy.steps[currentStep].ingredients.indexOf(toDelete)
    if (index > -1) {
      recipeCopy.steps[currentStep].ingredients.splice(index, 1)
      updateRecipe(recipeCopy)
    }
    deleteError(ingredientId)
  }

  const handleChange = (data: {
    target: { name: any; value: any; id?: any }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    updateValue(name, value, id)
  }

  return (
    <React.Fragment>
      <div className="mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl ">
        <div className="grid grid-cols-3">
          <div className="grid grid-rows-2 col-span-2">
            <span className="text-4xl">Step {currentStep + 1}:</span>
            <input
              className="bg-transparent w-full text-4xl text-gray-700 leading-tight focus:outline-none"
              type="text"
              placeholder="Title"
              name="stepTitle"
              value={recipe.steps[currentStep].stepTitle || ''}
              onChange={handleChange}
            ></input>
          </div>
          <div className="text-center rounded">
            <div className=" grid items-center bg-gray-100 p-4 w-28 h-28 lg:w-32 lg:h-32 m-auto">
              <img className="m-auto" src={IMAGE} />
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="text-center bg-gray-200 p-2 rounded">
            {recipe.steps[currentStep].ingredients.map((ing) => (
              <div className="grid grid-cols-2 mt-2 p-2  rounded bg-white h-full">
                <div className="rounded text-center grid ">
                  <Autocomplete
                    id={ing.id + '-name'}
                    className="bg-white md:text-4xl  text-2xl md:w-1/2 m-auto text-center focus:outline-none p-2 rounded "
                    style={{ width: '100%' }}
                    options={ingredients}
                    getOptionLabel={(option) => option.name}
                    freeSolo
                    autoHighlight={true}
                    value={
                      ingredients.filter((e) => e.name === ing.name)[0] || {}
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="INGREDIENT"
                        variant="outlined"
                        margin="normal"
                        error={
                          !!getError(ing.id + '-name').length ? true : false
                        }
                        helperText={
                          !!getError(ing.id + '-name').length
                            ? getError(ing.id + '-name')[0].message
                            : false
                        }
                      />
                    )}
                    onChange={(
                      event: object,
                      value: any | any[],
                      reason: string
                    ) => {
                      updateValue(
                        'name',
                        value ? value.name : '',
                        ing.id + '-name'
                      )
                    }}
                  />
                  <DeleteX
                    className="absolute text-pink-200"
                    onClick={() => deleteIngredient(ing.id.toString())}
                  />
                </div>
                <div className="grid grid-cols-4 rounded justify-center m-auto ">
                  <input
                    id={ing.id + '-quantity'}
                    className="w-full text-2xl focus:outline-none rounded text-center m-auto"
                    value={ing.quantity || ''}
                    name="quantity"
                    placeholder="#"
                    onChange={handleChange}
                  ></input>

                  <Autocomplete
                    id={ing.id + '-unit'}
                    className=" w-full  focus:outline-none p-2 rounded text-center m-auto col-span-3"
                    style={{ width: '100%' }}
                    options={units}
                    getOptionLabel={(option) => option.name}
                    autoHighlight={true}
                    value={units.filter((e) => e.name === ing.unit)[0] || {}}
                    closeIcon=""
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unit"
                        margin="normal"
                        error={
                          !!getError(ing.id + '-unit').length ? true : false
                        }
                        helperText={
                          !!getError(ing.id + '-unit').length
                            ? getError(ing.id + '-unit')[0].message
                            : false
                        }
                      />
                    )}
                    onChange={(
                      event: object,
                      value: any | any[],
                      reason: string
                    ) => {
                      updateValue(
                        'unit',
                        value ? value.name : '',
                        ing.id + '-unit'
                      )
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                className="bg-orange-200 hover:bg-orange-300 focus:outline-none text-gray-800 p-2 rounded m-4 w-6/12"
                onClick={createIngredient}
              >
                Add Ingredient
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <div className=" w-full bg-gray-200 p-4 h-56 rounded ">
            <textarea
              className={
                (getError('customInfo').length ? 'border border-red-600' : '') +
                ' resize-none  w-full h-full text-xl bg-white p-2 outline-none rounded'
              }
              placeholder="Describe the step in concise detail!"
              name="customInfo"
              value={recipe.steps[currentStep].customInfo || ''}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

interface RecipeReviewProps {
  recipe: RecipeInputType
  goToStep: (step: number) => void
  updateRecipe: (updatedRecipe: RecipeInputType) => void
  getError: (key: string) => Array<Error>
  updateError: (key: string, value?: string | number) => void
  deleteError: (key: string) => void
}
const RecipeReviewMode: React.FC<RecipeReviewProps> = ({
  recipe,
  goToStep,
  updateRecipe,
  getError,
  updateError,
  deleteError,
}) => {
  const updateValue = (name: string, value: string | number) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let index = -1
    switch (name) {
      case 'hours':
      case 'minutes':
      case 'seconds':
        recipeCopy.time[name] = value
        break
      default:
        recipeCopy[name] = value
        break
    }
    updateRecipe(recipeCopy)
    updateError(name, value)
  }

  const handleChange = (data: { target: { name: any; value: any } }) => {
    const { name, value }: { name: string; value: string } = data.target
    updateValue(name, value)
  }
  return (
    <React.Fragment>
      <div className=" mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl border-purple-100 border-2">
        <div className="m-2 mb-8">
          <input
            className="bg-transparent w-full text-5xl text-gray-700  py-1 leading-tight focus:outline-none  border-b-4 border-black "
            type="text"
            placeholder="Title"
            name="title"
            value={recipe.title || ''}
            onChange={handleChange}
          ></input>
        </div>
        {recipe.steps.map((step) => {
          let index = recipe.steps.indexOf(step)
          return (
            <StepMiniView
              recipe={recipe}
              stepIndex={index}
              onClick={() => {
                goToStep(index)
              }}
            />
          )
        })}
        <div className="grid grid-cols-3  my-8">
          <div className=" grid items-center bg-gray-100 p-2 w-32 h-32 m-auto">
            <img className="p-4  m-auto" src={IMAGE} />
          </div>{' '}
          <div className=" grid items-center bg-gray-100 p-2 w-32 h-32 m-auto">
            <img className="p-4  m-auto" src={IMAGE} />
          </div>{' '}
          <div className=" grid items-center bg-gray-100 p-2 w-32 h-32 m-auto">
            <img className="p-4  m-auto" src={IMAGE} />
          </div>
        </div>
        <div className="grid  grid-cols-2 bg-gray-200 p-2 gap-4  rounded ">
          <div className="grid  grid-rows-2 p-2 rounded ">
            <img src={TIME} className="h-8 m-auto cursor-pointer rounded" />
            <div className=" grid grid-cols-2 text-center gap-4 text-xs">
              <div className="w-full rounded">
                <input
                  className="text-xl w-full text-center focus:outline-none rounded appearance-none"
                  type="number"
                  min="00"
                  max="48"
                  step="1"
                  placeholder="H"
                  name="hours"
                  value={recipe.time.hours || ''}
                  onChange={handleChange}
                ></input>
                Hours
              </div>
              <div className="w-full rounded">
                <input
                  className="text-xl w-full text-center focus:outline-none rounded appearance-none"
                  type="number"
                  min="00"
                  max="60"
                  step="1"
                  placeholder="M"
                  name="minutes"
                  value={recipe.time.minutes || ''}
                  onChange={handleChange}
                ></input>
                Minutes
              </div>
            </div>
          </div>
          <div className="grid  grid-rows-2 p-2 rounded text-center text-xs ">
            <img src={CUTLERY} className="h-8 m-auto cursor-pointer rounded" />
            <div className="w-full rounded">
              <input
                className="text-xl w text-center focus:outline-none rounded appearance-none"
                type="number"
                min="1"
                step="1"
                placeholder="Servings"
                name="servings"
                value={recipe.servings || ''}
                onChange={handleChange}
              ></input>
              Servings
            </div>
          </div>
        </div>
        <div className=" w-full   my-4 h-40 rounded ">
          <textarea
            placeholder="Description and tags"
            className="resize-none h-full w-full text-xl mt-4 text-gray-700 bg-gray-200 rounded p-4 outline-none"
            name="description"
            value={recipe.description || ''}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </React.Fragment>
  )
}
//end HELPER COMPONENTS

//start MAIN COMPONENT
const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeInit = NewRecipe(),
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
  submit,
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])
  const [recipe, setRecipe] = React.useState<RecipeInputType>(recipeInit)
  const [currentStep, setCurrentStep] = React.useState(stepInit)
  const [reviewMode, setReviewMode] = React.useState(reviewModeInit)
  const [errors, setErrors] = React.useState<Array<Error>>(errorsInit)
  const [loaded, setLoaded] = React.useState(false)

  const createError = (key: string, error: string, message: string) => {
    if (!getError(key).length) {
      let err: Error = NewError(key, error, message, currentStep)
      setErrors((errors) => [...errors, err])
    }
  }

  const deleteError = (key: string) => {
    let updatedErrors = errors.filter((err) => err.key != key)
    setErrors(updatedErrors)
  }

  const updateError = (key: string, value?: string | number) => {
    if (value && getError(key).length) deleteError(key)
  }

  const getError = (key: string) => {
    return errors.filter((err) => err.key == key)
  }

  const createStep = () => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let newStep: RecipeInputStepType = NewStep()
    recipeCopy.steps.push(newStep)
    setRecipe(recipeCopy)
  }

  const deleteStep = (stepNum: number) => {
    if (stepNum > -1) {
      let recipeCopy = JSON.parse(JSON.stringify(recipe))
      if (recipeCopy.steps.length == 1) recipeCopy.steps[0] = NewStep()
      else recipeCopy.steps.splice(stepNum, 1)
      setRecipe(recipeCopy)
      goToStep(currentStep - 1)
    }
  }

  const submitStep = (index: number) => {
    if (validateStep(currentStep)) {
      if (currentStep === recipe.steps.length - 1) createStep()
      goToStep(index)
    }
  }

  const goToStep = (stepNum: number) => {
    if (stepNum < 0) stepNum = 0
    setCurrentStep(stepNum)
    setReviewMode(false)
  }

  const validateStep = (stepNum: number) => {
    const { ingredients, customInfo } = recipe.steps[stepNum]
    return (
      (!ingredients.length ||
        ingredients
          .map((ing) => {
            return (
              validateValue(ing.id + '-name', ing.name, 'required') &&
              validateValue(ing.id + '-quantity', ing.quantity, 'required')
            )
          })
          .indexOf(false) < 0) &&
      validateValue('customInfo', customInfo, 'required')
    )
  }

  const validateValue = (errorKey: string, value: any, validation: string) => {
    let ret = true
    switch (validation) {
      case 'required':
        if (!value) {
          createError(errorKey, 'required', 'This field is required.')
          ret = false
        }
        break
      default:
        break
    }
    //if no errors with key remove old error from error object
    if (!!ret && getError(errorKey).length) deleteError(errorKey)
    return ret
  }

  const goToReview = () => {
    let totalSteps = recipe.steps.length
    let badSteps = []
    for (let index = 0; index < totalSteps; index++) {
      if (!validateStep(index)) badSteps.push(index)
    }
    if (!!badSteps.length) goToStep(badSteps[0])
    else setReviewMode(true)
  }

  const updateRecipe = (updatedRecipe: RecipeInputType) => {
    setRecipe(updatedRecipe)
  }

  const submitRecipe = () => {
    if (validateValue('title', recipe.title, 'required')) {
      console.log('submitting recipe: ', recipe)
      submit({ attributes: recipe })
    }
  }

  React.useEffect(() => setLoaded(true), [])

  return (
    <div className="max-w-xl lg:my-8 mx-auto">
      {loaded && !reviewMode ? (
        <React.Fragment>
          {recipe.steps.map((step) => {
            let index = recipe.steps.indexOf(step)
            if (currentStep !== index) {
              return (
                <StepMiniView
                  recipe={recipe}
                  stepIndex={index}
                  onClick={() => goToStep(index)}
                />
              )
            } else {
              return (
                <React.Fragment>
                  <DeleteX
                    className="m-2 mr-2 float-right"
                    onClick={() => deleteStep(currentStep)}
                  />
                  <RecipeStepMode
                    recipe={recipe}
                    updateRecipe={updateRecipe}
                    step={currentStep}
                    getError={getError}
                    updateError={updateError}
                    deleteError={deleteError}
                  />
                  <div className="w-full mt-8 mb-8">
                    <div className="grid col-gap-4 grid-cols-2">
                      <button
                        className="bg-blue-200 hover:bg-blue-300 focus:outline-none text-xl text-gray-800 font-bold py-2  rounded"
                        onClick={goToReview}
                      >
                        Finish
                      </button>
                      <button
                        className="bg-orange-200 hover:bg-orange-300 focus:outline-none text-xl text-gray-800 font-bold py-2 rounded"
                        onClick={() => submitStep(currentStep + 1)}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              )
            }
          })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <RecipeReviewMode
            recipe={recipe}
            updateRecipe={updateRecipe}
            goToStep={goToStep}
            getError={getError}
            updateError={updateError}
            deleteError={deleteError}
          />
          <button
            className="bg-orange-200 hover:bg-orange-300 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 rounded"
            onClick={submitRecipe}
          >
            Post Recipe
          </button>
        </React.Fragment>
      )}
    </div>
  )
}

export default RecipeForm
