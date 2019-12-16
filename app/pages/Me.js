import React, { PureComponent } from 'react';
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
    Animated,
    AsyncStorage,
    Easing
} from 'react-native';
// import Storage from '../Storage';
// import StackNavigtor from 'react-navigation';
import JPushModule from '../NotifService'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class Me extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            rotation: new Animated.Value(0),
            scale: new Animated.Value(1),
            translateY: new Animated.Value(10),
            opacity: new Animated.Value(0),
            isLogin:false,
            userInfo:{}
        }
         
    }

    getStorage(){
        if(!global.storage) return;
        let cache =(global.storage.cache || {}).userInfo;
        if(cache){
            let userInfo =(cache.rawData || {}).userInfo
            if(!userInfo) return;
            this.setState({
                userInfo:userInfo,
                isLogin:true
            })
            this.settingData[3].isHide =false;
        }
    }

    // 本地缓存
    StoreSave(key, value) {
        if(typeof value != 'string') value=JSON.stringify(value);
        return AsyncStorage.setItem(key, value)
    }

    qureyStore(key,cb){
        AsyncStorage.getItem(key, (err, result) => {
            if (!err) {
                try{
                    result =result || '{}';
                    const jsonValue = JSON.parse(result)
                    cb && cb(jsonValue)
                }catch(err){

                }
                
            }else{
                // console.log(err)
            }
        })
    }
     

    returnData(isLogin, userInfo) {
        this.setState({id:isLogin, userInfo: userInfo});
    }

    _onPressItem =(item) => {
        let _this =this;
        // 打开设备列表
        if(item['deviceList']){
            const navigation =_this.props.navigation.push;
            navigation('DeviceList')
            return 
        }
        // 打开设备状态列表
        if(item["deviceState"]){
            const navigation =_this.props.navigation.push;
            navigation('DeviceState')
            return 
        }

        if(item["about"]){
            const navigation =_this.props.navigation.push;
            navigation('About');
            return 
        }

        if(item["exitLogin"]){
            // 默认关闭通知
            // JPushModule.colseLients();
            JPushModule.openLients(true);

            const userInfo =_this.state.userInfo;
            _this.setState({
                isLogin:false,
                userInfo:{},
            })
            item.isHide=true;
            if(global.storage) global.storage.cache={};

             _this.qureyStore('loginSave',(data)=>{
                data.is_exit=true;
                _this.StoreSave('loginSave',data)

                const navigation =_this.props.navigation.push;
                navigation('Login', userInfo);
             })
           
            
        }

    }

    settingData = [
        {
            leftText: 'Device List',
            deviceList:true,
            isHide:false

        },
        {
            leftText: 'Device Notification',
            deviceState:true,
            isHide:false

        },
        {
            leftText: 'About Us',
            about:true,
            isHide:false
        },
        {
            leftText: 'Exit Login',
            exitLogin:true,
            isHide:true

        },
       
    ]
    componentDidMount() {
        let _this =this;
        _this.getStorage();
        var params =((_this.props.navigation || {}).state || {}).params || {};
        if(params.tel || params.yunid){
            _this.setState({
                userInfo: params,
                isLogin:true
            })
            _this.settingData[3].isHide =false;
        }else{
             _this.qureyStore('loginSave',(data)=>{
                if(data.yunid && !data.is_exit){
                    _this.setState({
                         userInfo: data,
                         isLogin:true
                    })
                   
                }
             })
              _this.settingData[3].isHide =false;
             
        }
        //顺序执行
        Animated.sequence([
            //随着时间发展执行
            Animated.timing(
                this.state.rotation,{
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                }
            ),
            Animated.timing(
                this.state.scale,{
                    toValue: 1.3,
                    duration: 600,
                }
            ),
            //同时执行
            Animated.parallel([
                Animated.timing(
                    this.state.scale,{
                        toValue: 1,
                        duration: 500,
                    }
                ),
                Animated.timing(
                    this.state.opacity,{
                        toValue: 1,
                        duration: 1000,
                    }
                ),
                Animated.timing(
                    this.state.translateY,{
                        toValue: 0,
                        duration: 600,
                    }
                )
            ])
        ])
    }

    // 登录
    login = (item) =>{
        const navigation =this.props.navigation.push;
        if(this.state.isLogin) return navigation('Userinfo', this.state);
        navigation('Login', {item})
    }


    
    
    render(){
        const loginInfo =(this.state || {}).userInfo || {};

        return (
            <ScrollView style={styles.container}>
                
            {/* 头部 */}
            <View style={styles.headContainer}>
                {/* 夜间/签到 */}
                <View style={styles.headTopContainer}>
                    {/* <TouchableOpacity style={styles.topBtnStyle} activeOpacity={0.9} onPress={() => {alert('夜间')}}>
                        <Image source={require('./../../assets/images/i_night.png')} style={styles.headTopImg} resizeMode={'contain'} />
                        <Text style={styles.headTopText}>夜间</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={styles.topBtnStyle} activeOpacity={0.9} onPress={() => {alert('签到')}}>
                        <Image source={require('./../../assets/images/i_sign.png')} style={styles.headTopImg} resizeMode={'contain'} />
                        <Text style={styles.headTopText}>夜间</Text>
                    </TouchableOpacity> */}
                </View>

                {/* 头像、昵称、标签 */}
                <TouchableOpacity 
                    item={this.state} 
                    onPress={this.login} >
                    <View style={styles.headCenterContainer}>
                        <Animated.Image style={styles.userImg}  source={require('./../../assets/images/nickThumb.png')} resizeMode={'contain'} />

                        <Animated.Text style={styles.userNickname}>{loginInfo.tel || loginInfo.yunid || 'Not logged in'}</Animated.Text>

                        {/* 登录信息 */}
                        {/* <View style={styles.positionContainer}>
                            <Text>
                                {loginInfo.tel || loginInfo.yunid || 'Not logged in'}
                            </Text>
                        </View> */}
                    </View>
                </TouchableOpacity>

            </View>

            {/* 过渡条 */}
            <View style={styles.transitionView}></View>

            {/* 设置列表 */}
            <View style={styles.settingListContainer}>
                {
                  
                    this.settingData.map((item, index) => {

                        const isComponent=item.isHide? null :
                                <ListItem
                                    key={index}
                                    item={item}
                                    onPressItem={this._onPressItem}
                                    leftText={item.leftText}
                                    rightText={item.rightText}
                                    rightComponent={item.rightComponent}
                                    isShowArrow={item.isShowUnderline}
                                    onPress={item.onPress}
                                />;
                        return(
                            <View key={index}>
                                {isComponent}
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
        )
    }
}
class ListItem extends React.PureComponent {
    constructor(props){
        super(props)
    }
    static defaultProps = {
        leftText: '',
        rightText: '',
        isShowUnderline: true,
        isShowArrow: true,
    }

    _onPress = () => {
        this.props.onPressItem(this.props.item)
    }

    _renderRight = () => {
        if (!this.props.rightText && !this.props.rightComponent) {
            return <Text />
        }

        if (this.props.rightText) {
            return(
                <Text style={styles.itemRightText}>
                    {this.props.rightText}
                </Text>
            )
        }

        if (this.props.rightComponent) {
            return(
                <this.props.rightComponent />
            )
        }
    }

    render(){
        let item = this.props.item;
        return(
            <TouchableOpacity activeOpacity={0.9} style={[styles.itemContainer, this.props.isShowUnderline && styles.itemBorderBottom]} onPress={this._onPress}>
                <Text style={styles.itemLeftText}>{this.props.leftText}</Text>

                <View style={styles.itemRightContainer}>
                    {
                        this._renderRight()
                    }
                    {
                        !this.props.rightComponent && this.props.isShowArrow && <Image style={styles.itemRightImg} source={require('./../../assets/images/i_right.png')}/>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    itemBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    itemLeftText: {
        fontSize: 15,
        color: '#000',
    },
    itemRightContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    itemRightText: {
        color: '#bfbfbf',
        fontSize: 12,
    },
    itemRightImg: {
        width: 20,
        height: 20,
        marginHorizontal: 7,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    headContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        paddingTop: 30,
    },
    headTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    topBtnStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 30,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 20,
    },
    headTopImg: {
        width: 15,
        height: 15,
        marginRight: 5,
        
    },
    headTopText: {
        fontSize: 12,
        color: '#515151'
    },
    headCenterContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    userImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    userNickname: {
        marginVertical: 5,
        fontSize: 18,
        color: '#000'
    },
    positionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    positionImg: {
        width: 10,
        height: 10,
        marginRight: 2
    },
    positionText: {
        color: '#bfbfbf',
        fontSize: 10
    },
    headBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottomBtn: {
      alignItems: 'center'
    },
    bottomNum: {
        fontSize: 20,
        color: '#000'
    },
    bottomText: {
        color: '#bfbfbf',
        fontSize: 12
    },
    transitionView: {
        height: 5,
        backgroundColor: 'rgba(230,230,230, .5)'
    },
    settingListContainer: {
        paddingLeft: 20,
    }
})