import App from "./App"
import AdminRoute from "./components/AdminRoute"
import AdminLayout from "./components/layout/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import MemberLayout from "./components/layout/MemberLayout"
import { pathnames } from "./lib/pathname"
import { AdminDashboard, AdminLeads, AdminPosts, AdminReports, AdminUsers } from "./pages/admin"
import { CreatePost, EditPost, MemberDashboard, MemberLeads, MyPosts, Profile, WishlistPage } from "./pages/member"
import { HomePage, News, PostDetail, PublicLayout, RentProperty, SoldProperty } from "./pages/publics"

const childPath = (path) => path.replace(/^\//, '')

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
                        path: childPath(pathnames.publics.news),
                        element: <News />
                    },
                    {
                        path: childPath(pathnames.publics.soldProperty),
                        element: <SoldProperty />
                    },
                    {
                        path: childPath(pathnames.publics.rentProperty),
                        element: <RentProperty />
                    },
                    {
                        path: childPath(pathnames.publics.postDetail),
                        element: <PostDetail />
                    },
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: pathnames.users.layout,
                        element: <MemberLayout />,
                        children: [
                            {
                                path: pathnames.users.dashboard,
                                element: <MemberDashboard />
                            },
                            {
                                path: childPath(pathnames.users.newPost),
                                element: <CreatePost />
                            },
                            {
                                path: childPath(pathnames.users.myPosts),
                                element: <MyPosts />
                            },
                            {
                                path: childPath(pathnames.users.leads),
                                element: <MemberLeads />
                            },
                            {
                                path: childPath(pathnames.users.editPost),
                                element: <EditPost />
                            },
                            {
                                path: childPath(pathnames.users.wishlist),
                                element: <WishlistPage />
                            },
                            {
                                path: childPath(pathnames.users.personal),
                                element: <Profile />
                            },
                        ]
                    }
                ]
            },
            {
                element: <AdminRoute />,
                children: [
                    {
                        path: pathnames.admin.layout,
                        element: <AdminLayout />,
                        children: [
                            {
                                path: pathnames.admin.dashboard,
                                element: <AdminDashboard />
                            },
                            {
                                path: childPath(pathnames.admin.posts),
                                element: <AdminPosts />
                            },
                            {
                                path: childPath(pathnames.admin.leads),
                                element: <AdminLeads />
                            },
                            {
                                path: childPath(pathnames.admin.reports),
                                element: <AdminReports />
                            },
                            {
                                path: childPath(pathnames.admin.users),
                                element: <AdminUsers />
                            },
                        ]
                    }
                ]
            }
        ]
    }
]

export default routes
