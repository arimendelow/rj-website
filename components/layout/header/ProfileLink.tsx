import Link from 'next/link'

import { CurrentUserLoginCheckType } from 'requests/auth'

type LogoProps = {
  closeMenus(): void
  currentUserInfo: CurrentUserLoginCheckType
}

const Logo: React.FC<LogoProps> = ({ closeMenus, currentUserInfo }) => {
  return (
    // Logo, wrapped in an h2 tag
    <h2>
      <Link href="/[username]" as={`/${currentUserInfo.me.username}`}>
        {/* Need to close any open menus when navigating to another page, hence the onClick */}
        <a
          aria-label="RecipeJoiner create new recipe page"
          onClick={() => closeMenus()}
        >
          <svg
            className="w-10 p-1 text-gray-900 hover:text-gray-700 fill-current"
            viewBox="0 0 189 189"
            version="1.1"
          >
            <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
              <g id="UI-Icons" transform="translate(-39.000000, -249.000000)">
                <path
                  d="M133.5,249 C185.690909,249 228,291.309091 228,343.5 C228,395.690909 185.690909,438 133.5,438 C81.3090911,438 39,395.690909 39,343.5 C39,291.309091 81.3090911,249 133.5,249 Z M133.5,263 C89.0410776,263 53,299.041078 53,343.5 C53,387.958922 89.0410776,424 133.5,424 C177.958922,424 214,387.958922 214,343.5 C214,299.041078 177.958922,263 133.5,263 Z M133.5,336 C156.617345,336 169.097848,356.622009 170.94151,397.866026 C171.015503,399.521229 169.733676,400.923017 168.078473,400.997007 C168.033844,400.999002 167.989176,401 167.944502,401 L161.46624,401 C160.066669,401 158.863873,400.029902 158.555501,398.681056 L158.520409,398.50302 L158.520409,398.50302 C156.432083,386.224563 155.306397,375.640368 152.503225,367.930132 C147.772037,354.916812 140.702609,349 133.935065,349 C127.230359,349 119.288594,354.283005 114.582603,367.055786 C112.77591,371.95943 110.990015,382.384187 109.224921,398.330056 C109.056691,399.849899 107.772257,401 106.243133,401 L99.0507239,401 C97.3938605,401.000016 96.0507074,399.656863 96.0507074,398 C96.0507074,397.955248 96.0517088,397.910502 96.0537108,397.865794 C97.9006023,356.621931 110.382699,336 133.5,336 Z M133.5,278 C147.583261,278 159,289.416739 159,303.5 C159,317.583261 147.583261,329 133.5,329 C119.416739,329 108,317.583261 108,303.5 C108,289.416739 119.416739,278 133.5,278 Z M133.5,289 C125.491871,289 119,295.491871 119,303.5 C119,311.508129 125.491871,318 133.5,318 C141.508129,318 148,311.508129 148,303.5 C148,295.491871 141.508129,289 133.5,289 Z"
                  id="user"
                />
              </g>
            </g>
          </svg>
        </a>
      </Link>
    </h2>
  )
}

export default Logo
