import App from "./App"
import { pathnames } from "./lib/pathname"
import { HomePage, News, PublicLayout, RentProperty, SoldProperty } from "./pages/publics"
const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: pathnames.publics.layout,
                element: <PublicLayout />,
                children: [
                    {
                        path: pathnames.publics.homepage,
                        element: <HomePage />
                    },
                    {
                        path: pathnames.publics.news,
                        element: <News />
                    },
                    {
                        path: pathnames.publics.soldProperty,
                        element: <SoldProperty />
                    },
                    {
                        path: pathnames.publics.rentProperty,
                        element: <RentProperty />
                    },
                ]
            }
        ]
    }
]

export default routes