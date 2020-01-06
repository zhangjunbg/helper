import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/views/layout/Layout'
import Empty from '@/views/layout/Empty'
export const constantRouterMap = [{
    // 查询
      path: '/search',
      component: Layout,
      redirect: '/search/index',
      children: [{
          // 查词
          path: 'search',
          component: () => import('@/views/search/index'),
          name: 'search',
          redirect: '/search/index',
          meta: {
            title: 'home',
            icon: "icon24 icon3_1"
          },
          children: [{
              // 查词
              path: 'index',
              component: () => import('@/views/search/index'),
              name: 'search',
              meta: {
                title: 'home',
                icon: "icon24 icon3_1"
              }
            ]

          },
          {
            // 背词
            path: 'recite',
            component: () => import('@/views/recite/index'),
            name: 'recite',
            meta: {
              title: '背词',
              icon: "icon24 icon3_1"
            }
          },
          {
            // 书架
            path: 'bookshelf',
            component: () => import('@/views/bookshelf'),
            name: 'bookshelf',
            meta: {
              title: 'bookshelf',
              icon: "icon24 icon3_1"
            }
          },
          {
            // 操作
            path: 'operation',
            component: () => import('@/views/operation'),
            name: 'operation',
            meta: {
              title: 'operation',
              icon: "icon24 icon3_1"
            }
          },
          {
            // 生词本
            path: 'words',
            component: () => import('@/views/words'),
            name: 'words',
            meta: {
              title: 'words',
              icon: "icon24 icon3_1"
            }
          },
          {
            path: '404',
            name: '404',
            hidden: true,
            component: () => import('@/views/404'),
          }
        ]
      },
      {
        path: '/search',
        component: Layout,
        redirect: '/search/index',
        children: [{
            // 查词
            path: 'search',
            component: () => import('@/views/search/index'),
            name: 'search',
            redirect: '/search/index',
            meta: {
              title: 'home',
              icon: "icon24 icon3_1"
            },
            children: [{
                // 查词
                path: 'index',
                component: () => import('@/views/search/index'),
                name: 'search',
                meta: {
                  title: 'home',
                  icon: "icon24 icon3_1"
                }
              ]
  
            },
            {
              // 背词
              path: 'recite',
              component: () => import('@/views/recite/index'),
              name: 'recite',
              meta: {
                title: '背词',
                icon: "icon24 icon3_1"
              }
            },
            {
              // 书架
              path: 'bookshelf',
              component: () => import('@/views/bookshelf'),
              name: 'bookshelf',
              meta: {
                title: 'bookshelf',
                icon: "icon24 icon3_1"
              }
            },
            {
              // 操作
              path: 'operation',
              component: () => import('@/views/operation'),
              name: 'operation',
              meta: {
                title: 'operation',
                icon: "icon24 icon3_1"
              }
            },
            {
              // 生词本
              path: 'words',
              component: () => import('@/views/words'),
              name: 'words',
              meta: {
                title: 'words',
                icon: "icon24 icon3_1"
              }
            },
            {
              path: '404',
              name: '404',
              hidden: true,
              component: () => import('@/views/404'),
            }
          ]
        },
      {
        path: '*',
        redirect: '/404',
        hidden: true
      }
    ]
    const router = new Router({
      mode: 'history', // require service support
      scrollBehavior: () => ({
        y: 0
      }),
      routes: constantRouterMap
    })
    export default router