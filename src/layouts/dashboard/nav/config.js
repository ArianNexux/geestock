// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const iconPng = (name) => <SvgColor src={`/assets/icons/navbar/${name}.png`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Armazéns',
    path: '/dashboard/armazem',
    icon: iconPng('containers'),
  },
  {
    title: 'Peças',
    path: '/dashboard/peca',
    icon: iconPng('pecas-de-reposicao'),
  },
  {
    title: 'Requisições',
    path: '/dashboard/requisicao',
    icon: iconPng('pedido'),
  }, 
  {
    title: 'Notas de Entrega',
    path: '/dashboard/nota-entrega',
    icon: iconPng('nota-de-entrega'),
  },
  {
    title: 'Utilizadores',
    path: '/dashboard/usuario',
    icon: icon('ic_user'),
  },
  {
    title: 'Categorias',
    path: '/dashboard/categoria',
    icon: iconPng('categorizacao'),
  },
  {
    title: 'Sub-Categorias',
    path: '/dashboard/subcategoria',
    icon: iconPng('categorizacao'),
  },
  {
    title: 'Transportes',
    path: '/dashboard/transporte',
    icon: iconPng('cargueiro'),
  },

];

export default navConfig;
