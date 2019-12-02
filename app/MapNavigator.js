import React,{ PureComponent } from 'react';
import {
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import Location from './pages/Location';
import Me from './pages/Me';

const MainThumbLocation = require("./../assets/images/location.png");
const MainThumbLocationActive = require("./../assets/images/location_active.png");
const MainThumbMe= require("./../assets/images/me.png");
const MainThumbMeActive = require("./../assets/images/me_active.png");

export default MainTab =TabNavigator({
    Location:{
        screen:Location,
        navigationOptions:({navigation, screeProps}) => ({
            header:null,
            headerTitle:'Location',
            headerStyle: styles.navigator,
            headerTitleStyle:styles.headerTitleStyle,
            // 是否支持手势滑动关闭 默认IOS true Android false
            gesturesEnabled:false,
            // Android 特性，按下水波纹效果的颜色（版本须大于 5.0）。
            headerPressColorAndroid:'#000',
             //这里设置Tabbar不同页面可能会不同的属性
            tabBarVisible: true,
            tabBarLabel:'Location',
            tabBarIcon:(({tintColor,focused}) => {
                return(
                    <Image 
                        source={focused ? MainThumbLocationActive : MainThumbLocation}
                        style={styles.tabbarImage} 
                    />
                )
            }),

        })
    },
    Me:{
        screen:Me,
        navigationOptions:({navigation,screeProps}) =>({
            header:null,
            headerTitle:'Me',
            headerStyle: styles.navigator,
            headerTitleStyle:styles.headerTitleStyle,
            gesturesEnabled:false,
            headerPressColorAndroid:"#000",
            inactiveBackgroundColor:'#000000',
            tabBarVisible:true,
            tabBarIcon:(({tintColor,focused}) =>{
                return (
                    <Image
                        source={focused? MainThumbMeActive :MainThumbMe}
                        style={styles.tabbarImage}
                    />
                )
            })
        })
    }
},{
    //这里设置的是一般情况下Tabbar共同的属性
    tabBarPosition:'bottom', // 设置tabbar的位置，iOS默认在底部，安卓默认在顶部。（属性值:'top'，'bottom')
    swipeEnabled:false, // 是否允许在标签之间进行滑动。
    animationEnabled: false, // 是否在更改标签时显示动画。
    lazy:true, // 是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦。
    initialRouteName:'Me', // 设置默认的页面组件
    backBehavior:'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions:{
            style:{ backgroundColor:"#ffffff"}, 
            activeTintColor:'#5487e0', // label和icon的前景色 活跃状态下（选中）。
            inactiveTintColor:'#333333', // label和icon的前景色 不活跃状态下(未选中)。
            labelStyle:{
                fontSize: 12,
            }, //label的样式。
            showIcon: true 
    }
})

const styles =StyleSheet.create({
        headerTitleStyle:{
            fontSize:17,
            color:'#333333'
        },
        tabbarImage:{
            width:25,
            height:25,
            marginBottom:-3
        }
    })
