

 /*
    *   import MainTab from './TabNavigator'
    *   import NewsDetail from './pages/subPages/NewsDetail'
    *   import VideoDetail from './pages/subPages/VideoDetail'
    *   import NewsSearch from './pages/subPages/NewsSearch'




    *   //     --- 路由配置 ---

    *  // * 所有组件都必须在这里注册
    *  // * 在这里设置的navigationOptions的权限 > 对应页面里面的 static navigationOptions的设置 > StackNavigator()第二个参数里navigationOptions的设置
    *  // * 该配置文件会在App.js里的StackNavigator(导航组件)里使用。
    * const RouteConfig = {
        MainTab: {
            screen:MainTab,
            //navigationOptions: ({navigation}) => ({header: null})
        },
        NewsDetail: {
            screen: NewsDetail,
            navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
        },
        VideoDetail: {
            screen: VideoDetail,
            navigationOptions: ({navigation}) => ({header:null, gesturesEnable:true})
        },
        NewsSearch: {
            screen: NewsSearch,
            navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
        }
}
}
*/




// import MainTab from './TabNavigator'
// import NewsDetail from './pages/subPages/NewsDetail'
// import VideoDetail from './pages/subPages/VideoDetail'
// import NewsSearch from './pages/subPages/NewsSearch'
// const RouteConfig = {
//     MainTab: {
//         screen:MainTab,
//         //navigationOptions: ({navigation}) => ({header: null})
//     },
//     NewsDetail: {
//         screen: NewsDetail,
//         navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
//     },
//     VideoDetail: {
//         screen: VideoDetail,
//         navigationOptions: ({navigation}) => ({header:null, gesturesEnable:true})
//     },
//     NewsSearch: {
//         screen: NewsSearch,
//         navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
//     }
// }

import MainTab from './MapNavigator';
import DeviceList from './pages/subPages/DeviceList';
import DeviceState from './pages/subPages/DeviceState';
import Login from './pages/Login';
import Regist from './pages/Regist';
import Privacy from './pages/subPages/Privacy';
import Userinfo from './pages/subPages/Userinfo';
import About from './pages/subPages/About';

const RouteConfig = {
    MainTab: {
        screen:MainTab,
    },
    DeviceList:{
        screen:DeviceList,
        navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
    },
    DeviceState:{
        screen:DeviceState,
        navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
    },
    Login:{
        screen:Login,
        navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
    },
    Regist:{
        screen:Regist,
        navigationOptions:({navigation}) => ({header:null,gesturesEnable:true})
    },
    Privacy:{
        screen:Privacy,
        navigationOptions:({navigation}) => ({header:null,gesturesEnable:true})
    },
    Userinfo:{
        screen:Userinfo,
        navigationOptions:({navigation}) => ({header:null,gesturesEnable:true})
    },
    About:{
        screen:About,
        navigationOptions:({navigation}) => ({header:null,gesturesEnable:true})
    }

}



export default RouteConfig;