export default{
    base:'/admin/',
    plugins:[
        ['umi-plugin-react',{
            antd:true,
            axios:true
        }]
    ],
    routes:[{
        path:'/',
        component:'../layout',
        routes:[
            {
                path:'/',
                component:'./index'
            },
            {
                path:'/article',
                component:'article/index'
            },
            {
                path:'/manager',
                routes:[
                    {
                        path:' ',
                        component:'manager/articleManager'
                    },
                    {
                        path:'article',
                        component:'manager/articleManager'
                    },
                    {
                        path:'category',
                        component:'manager/categoryManager'
                    },
                    {
                        path:'comment',
                        component:'manager/commentManager'
                    },
                    {
                        path:'page',
                        component:'manager/pageManager'
                    },
                    {
                        path:'tag',
                        component:'manager/tagManager'
                    }
                ]
            },
            {
                path:'/setting',
                routes:[
                    {
                        path:' ',
                        component:'setting/basicSetting'
                    },
                    {
                        path:'basic',
                        component:'setting/basicSetting'
                    },
                    {
                        path:'theme',
                        component:'setting/themeSetting'
                    },
                    {
                        path:'user',
                        component:'setting/userSetting'
                    }
                ]
            },
            {
                path:'/other',
                component:'other/other'
            },
            {
                path:'/about',
                component:'other/about'
            }
           

        ]
    }]
};