import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';

const Router = DefaultRouter;

const routes = [
  {
    path: '/',
    component: require('../../layout').default,
    routes: [
      {
        path: '/',
        component: require('../index').default,
        exact: true,
      },
      {
        path: '/article',
        component: require('../article/index').default,
        exact: true,
      },
      {
        path: '/manager',
        routes: [
          {
            path: '/manager/ ',
            component: require('../manager/articleManager').default,
            exact: true,
          },
          {
            path: '/manager/article',
            component: require('../manager/articleManager').default,
            exact: true,
          },
          {
            path: '/manager/category',
            component: require('../manager/categoryManager').default,
            exact: true,
          },
          {
            path: '/manager/comment',
            component: require('../manager/commentManager').default,
            exact: true,
          },
          {
            path: '/manager/page',
            component: require('../manager/pageManager').default,
            exact: true,
          },
          {
            path: '/manager/tag',
            component: require('../manager/tagManager').default,
            exact: true,
          },
          {
            path: '/manager/user',
            component: require('../manager/userManager').default,
            exact: true,
          },
          {
            path: '/manager/power',
            component: require('../manager/powerManager').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/home/thetbw/workspace/html/None-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/setting',
        routes: [
          {
            path: '/setting/ ',
            component: require('../setting/basicSetting').default,
            exact: true,
          },
          {
            path: '/setting/basic',
            component: require('../setting/basicSetting').default,
            exact: true,
          },
          {
            path: '/setting/theme',
            component: require('../setting/themeSetting').default,
            exact: true,
          },
          {
            path: '/setting/user',
            component: require('../setting/userSetting').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/home/thetbw/workspace/html/None-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/other',
        component: require('../other/other').default,
        exact: true,
      },
      {
        path: '/about',
        component: require('../other/about').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/home/thetbw/workspace/html/None-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/home/thetbw/workspace/html/None-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
