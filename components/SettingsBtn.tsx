import * as React from 'react'
import Link from 'next/link'

import UserContext from 'helpers/UserContext'
import UserSettings from 'components/modalviews/UserSettings'

type SettingsBtnProps = {}

const SettingsBtn: React.FC<SettingsBtnProps> = ({}) => {
  const { modalOpen, setModalState } = React.useContext(UserContext)
  const openSettings = () => {
    setModalState && setModalState(true, 'Settings', <UserSettings />)
  }
  return (
    <button className="btn" onClick={openSettings}>
      {/* <svg
        className="h-12 p-2 text-gray-900 hover:text-gray-700 fill-current"
        viewBox="0 0 189 189"
        version="1.1"
      >
        <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
          <g id="UI-Icons" transform="translate(-258.000000, -249.000000)">
            <path
              d="M361.201373,249 C364.075793,249 366.721234,250.541158 368.14269,253.022756 L368.280718,253.274029 L374.418868,264.933841 C380.745241,266.700675 386.761121,269.211608 392.366217,272.366352 L405.088755,268.419059 C407.83096,267.568029 410.810745,268.253354 412.903519,270.197157 L413.116803,270.402718 L425.345954,282.631869 C427.376218,284.662133 428.157586,287.618187 427.412182,290.37544 L427.329613,290.659917 L423.404944,303.312167 C426.626337,308.995551 429.184649,315.104169 430.97474,321.532882 L442.725971,327.719282 C445.269598,329.058033 446.892809,331.653936 446.994885,334.511985 L447,334.798627 L447,352.09326 C447,354.96768 445.458842,357.613121 442.977244,359.034577 L442.725971,359.172606 L430.97474,365.359005 C429.219976,371.660849 426.727013,377.655109 423.594888,383.242745 L427.777753,396.722925 C428.511783,399.088133 427.920676,401.658257 426.244108,403.463316 L426.066807,403.647278 L412.898606,416.815479 C411.147462,418.566623 408.597807,419.240568 406.219621,418.597642 L405.974253,418.526425 L392.617768,414.383365 C386.960642,417.593893 380.881687,420.147246 374.484697,421.939631 L367.971459,434.313565 C366.816759,436.507494 364.577741,437.907545 362.112616,437.995588 L361.865381,438 L343.242732,438 C340.763486,438 338.481741,436.670721 337.255707,434.530292 L337.136654,434.313565 L330.658656,422.009652 C324.183836,420.217978 318.032603,417.647339 312.312167,414.404944 L299.025747,418.526425 L298.780379,418.597642 C296.490274,419.216756 294.041166,418.614738 292.299203,417.005606 L292.101394,416.815479 L278.933193,403.647278 L278.755892,403.463316 C277.141419,401.725111 276.533492,399.277463 277.146129,396.98652 L277.222247,396.722925 L281.366352,383.366217 C278.190715,377.724 275.667444,371.66554 273.898835,365.293133 L261.686435,358.863346 L261.469708,358.744293 C259.405723,357.562046 258.095983,355.398149 258.005063,353.022107 L258,352.757268 L258,334.134619 L258.004412,333.887384 C258.08931,331.5103 259.394176,329.343459 261.454433,328.156369 L261.686435,328.028541 L273.898835,321.598754 C275.702668,315.099436 278.291521,308.926694 281.556863,303.189058 L277.473575,290.025747 L277.402358,289.780379 C276.783244,287.490274 277.385262,285.041166 278.994394,283.299203 L279.184521,283.101394 L292.352722,269.933193 L292.536684,269.755892 C294.274889,268.141419 296.722537,267.533492 299.01348,268.146129 L299.277075,268.222247 L312.563802,272.344904 C318.232609,269.158313 324.321081,266.630046 330.725569,264.86375 L336.827394,253.274029 C338.166145,250.730402 340.762049,249.107191 343.620098,249.005115 L343.90674,249 L361.201373,249 Z M352.445944,274.013081 C314.099232,274.013081 283.013081,305.099232 283.013081,343.445944 C283.013081,381.792655 314.099232,412.878806 352.445944,412.878806 C390.792655,412.878806 421.878806,381.792655 421.878806,343.445944 C421.878806,305.099232 390.792655,274.013081 352.445944,274.013081 Z"
              id="settings"
            ></path>
          </g>
        </g>
      </svg> */}
      Settings
    </button>
  )
}

export default SettingsBtn
