import { Navigate, useRoutes } from 'react-router-dom';
import { useContext } from 'react';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/Users/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import FormUser from './pages/Users/FormUser';
import ContainerPage from './pages/Containers/ContainerPage';
import FormContainer from './pages/Containers/FormContainer';
import PiecesPage from './pages/Pieces/PiecesPage';
import FormPieces from './pages/Pieces/FormPieces';
import RequestsPage from './pages/Requests/RequestsPage';
import FormRequests from './pages/Requests/FormRequests';
import CategoryPage from './pages/Categories/CategoriesPage';
import FormCategory from './pages/Categories/FormCategories';
import ShippingPage from './pages/Shipping/ShippingPage';
import FormShipping from './pages/Shipping/FormShipping';
import SubcategoryPage from './pages/Subcategories/SubategoriesPage';
import FormSubcategory from './pages/Subcategories/FormSubcategories';
import RequestsForMe from './pages/Requests/RequestsForMe';
import OrderPage from './pages/Order/OrderPage';
import FormOrder from './pages/Order/FormOrder';
import SupplierPage from './pages/Supplier/SupplierPage';
import FormSupplier from './pages/Supplier/FormSupplier';
import { AppContext } from './context/context';
import LogsPage from './pages/Logs/LogsPage';
import InvoicePage from './pages/Invoice/InvoicePage';
import ConfirmOrder from './pages/Order/ConfirmOrder';

// ----------------------------------------------------------------------

export default function Router() {
  const LoggedRoutes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'usuario', element: <UserPage /> },
        { path: 'usuario/cadastrar', element: <FormUser /> },
        { path: 'usuario/editar/:id', element: <FormUser /> },
        { path: 'conta/editar/:type/:id', element: <FormUser /> },
        { path: 'armazem', element: <ContainerPage /> },
        { path: 'armazem/cadastrar', element: <FormContainer /> },
        { path: 'armazem/editar/:id', element: <FormContainer /> },
        { path: 'peca', element: <PiecesPage /> },
        { path: 'peca/cadastrar', element: <FormPieces /> },
        { path: 'peca/editar/:id', element: <FormPieces /> },
        { path: 'requisicao', element: <RequestsPage /> },
        { path: 'requisicao/cadastrar', element: <FormRequests /> },
        { path: 'requisicao/editar/:id', element: <FormRequests /> },
        { path: 'requisicao/minhas', element: <RequestsForMe /> },
        { path: 'categoria', element: <CategoryPage /> },
        { path: 'categoria/cadastrar', element: <FormCategory /> },
        { path: 'categoria/editar/:id', element: <FormCategory /> },
        { path: 'subcategoria', element: <SubcategoryPage /> },
        { path: 'subcategoria/cadastrar', element: <FormSubcategory /> },
        { path: 'subcategoria/editar/:id', element: <FormSubcategory /> },
        { path: 'transporte', element: <ShippingPage /> },
        { path: 'transporte/cadastrar', element: <FormShipping /> },
        { path: 'transporte/editar/:id', element: <FormShipping /> },
        { path: 'encomenda', element: <OrderPage /> },
        { path: 'encomenda/cadastrar', element: <FormOrder /> },
        { path: 'encomenda/editar/:id', element: <FormOrder /> },
        { path: 'confirmar-encomenda/:id', element: <ConfirmOrder /> },
        { path: 'auditoria', element: <LogsPage /> },
        { path: 'notas-entrega', element: <InvoicePage /> },
        { path: 'fornecedor', element: <SupplierPage /> },
        { path: 'fornecedor/cadastrar', element: <FormSupplier /> },
        { path: 'fornecedor/editar/:id', element: <FormSupplier /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    }
  ]);


  return LoggedRoutes;
}
