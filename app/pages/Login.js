import React, { PureComponent } from 'react' 
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    Button,
    View,
    Alert,
    Image,
    ScrollView,
    TextInput,
    TouchableHighlight,
    Keyboard,
    AsyncStorage
} from 'react-native';

import LoginHeader from './../components/LoginHeader';
import MD5 from "react-native-md5";
import ajax from './../utils/requestAjax';
// import { GET } from './../utils/requestAjax'
import Toast, {DURATION} from 'react-native-easy-toast';
import Storage from '../Storage';
import { LANG_CODE } from './../utils/config';
import JPushModule from '../NotifService';
import CheckBox from 'react-native-checkbox';


export default class Login extends PureComponent{
    constructor(props){
        super(props)
        
        this.state={
            newsData: '',
            body: '',
            // userInfo:{tel:'admin', userpwd:'aclinkcloud'},
            // userInfo:{tel:'13237111175', userpwd:'123456'},
            userInfo:{tel:'', userpwd:''},
            // userInfo:{tel:'18971661994', userpwd:'zjx520'},
            // userInfo:{tel:'', userpwd:''},
            link:'Me',
            checked:false
        }
    }
    
    // 本地缓存
    StoreSave(key, value) {
        if(typeof value != 'string') value=JSON.stringify(value);
        return AsyncStorage.setItem(key, value)
    }

    // 取出本地缓存
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
                 cb && cb({})
            }
        })
    }

    loginInMainpage(){
            const _this =this;
            const userName = _this.refs.inputLoginName._lastNativeText || this.state.userInfo.tel || this.state.userInfo.yunid || '';
            const userpwd = _this.refs.inputLoginPwd._lastNativeText || this.state.userInfo.userpwd || '';
            if(!userName){
                _this.refs.toast.show('ERR: username cannot be empty');
                return;
            }

            if(!userpwd){
                _this.refs.toast.show('ERR: passwd cannot be empty');
                return;
            }
            const passwd =MD5.hex_md5('mq' + userName + userpwd);

            
        ajax({
            url: `https://ac-link.com/webapi/login?login_id=${userName}&passwd=${passwd}`,
            method:'GET',
            success: (data) => {
                if(data.ret == 1){
                     _this.refs.toast.show('Login Success');
                     const userInfo =data.data;
                     if(!userInfo) return;
                     userInfo.userpwd =userpwd;
                    _this.setState({
                        userInfo:userInfo
                    })
                    // 判断是否为记住密码
                    userInfo.checked=_this.state.checked;
                    // 加入本地缓存
                    Storage.save({
                        key: 'userInfo',
                        data: {
                            userInfo: userInfo,
                        },
                        //expires为有效时间
                        expires: 1000* 500000
                    })
                    userInfo.is_exit=false;
                    _this.StoreSave('loginSave',userInfo)
                    JPushModule.openLients();
                    _this.props.navigation.navigate('Me',userInfo);
                    return;
                }
                 var err_msg=data.errCode != undefined ? LANG_CODE["errcode"+data.errCode] : data.msg;
                _this.refs.toast.show(err_msg);
 
            },
            error: (err,msg) => {
                // try{
                //     if(typeof msg != 'string') msg=JSON.stringify(msg);
                // }catch(e){
                //     console.log(e);
                // }
                // _this.refs.toast.show('Network request exception State:'+err+' error Info:'+msg);
                 _this.refs.toast.show('Error: network request failed. Please turn on Cellular Data or use Wi-Fi network, and check Settings -> Sphere WIFI GPS -> Wireless Data, allow "WLAN & Cellular Data"',15000)
                
            },
            complete:(res)=>{
                // console.log(res)
            }
        });
    }


    regist =(item)=>{
        const navigation =this.props.navigation.push;
        navigation('Regist', {item})
    }

    // getStorage(){
    //     if(!global.storage) return false;
    //     let cache =(global.storage.cache || {}).userInfo;
    //     if(cache) return (cache.rawData || {}).userInfo;
    //     return false;
    // }

    componentDidMount(){
        let _this =this;
        _this.qureyStore('loginSave',(data)=>{
            data =data || {};
            const userInfo =data.login_id? data: ((_this.props.navigation || {}).state || {}).params || {};
            if(userInfo.yunid || userInfo.tel){
                if(!userInfo.checked){
                    _this.setState({
                        checked:false
                    })
                    return;
                }
                _this.setState({
                    userInfo:userInfo,
                    checked:userInfo.checked || false
                })
            }else if(userInfo.userInfo){
                if(!userInfo.userInfo.checked){
                    _this.setState({
                        checked: false
                    }) 
                    return;
                }
                _this.setState({
                    userInfo:userInfo.userInfo,
                    checked:userInfo.userInfo.checked || false
                })
            }
        })
       


        // console.log(this.getStorage());
        // if(this.getStorage())
      
    }

    onCheckUpdate =(value) =>{
        this.setState({
            checked:!value
        })
    }
    // 组件渲染前
    // componentWillMount () {
    //     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    //     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    // }

    //键盘监听事件
    // _keyboardDidShow =(e) =>{
    //     this.state.keyboardHeight=e.endCoordinates.height;
    // }

    // _keyboardDidHide= ()=> {
    //     if(this.state) {
    //         this.state.keyboardHeight = 0;
    //     }
    // }

    // componentWillUnmount() {
        // this.state.keyboardHeight = 0;
        // this.refs.inputLoginName.blur();
        // this.refs.inputLoginPwd.blur();
        // this.keyboardDidShowListener.remove();
        // this.keyboardDidHideListener.remove();
    // }

    render(){
        const userInfo =this.state.userInfo || {};
        return (
            <View style={styles.container}>
                <LoginHeader navigation={this.props.navigation} centerText={"Login"} link={this.state.link} />
                <ScrollView style={styles.boxLogin}>
                    <View style={styles.item}><Text style={styles.textStyle}>Username:</Text>
                        <TextInput
                            ref="inputLoginName"
                            underlineColorAndroid="gray"
                            placeholder="Please enter username"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1}}
                            onChangeText={(input) => this.setState({tel: input})}
                        >{userInfo.tel || userInfo.yunid || ''}</TextInput>
                    </View>
                    <View style={styles.item}><Text style={styles.textStyle}>Password:</Text>
                        <TextInput
                            ref="inputLoginPwd"
                            underlineColorAndroid="gray"
                            placeholder="Please enter password"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1}}
                            secureTextEntry={true}
                             onChangeText={(input) => this.setState({userpwd: input})}
                            >{userInfo.userpwd || ''}</TextInput>
                    </View>
                    <View style={styles.regStyle}>
                        <CheckBox
                            label={'Remember the password'}
                            checked={this.state.checked}
                            labelBefore={false}
                            labelStyle={styles.lableStyle}
                            onChange={this.onCheckUpdate}
                        />
                    </View>
                    <TouchableHighlight 
                        style={styles.login}
                        underlayColor='#c2c2c2'
                        onPress={()=>this.loginInMainpage()}
                        >
                         <Text style={styles.loginText}>Sign In</Text>
                    </TouchableHighlight>

                    <View
                        style={styles.regStyle}
                    >
                       <Text item={this.props} onPress={this.regist}>Create new account</Text> 
                    </View> 
                </ScrollView>

                <Toast
                    ref='toast'
                    style={{backgroundColor:'black'}}
                    position='center'
                    delay={3000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
       
    },
    boxLogin:{
         padding:10
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        paddingTop:10
    },
    textStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 10
    },
    login: {
        height: 50,
        backgroundColor: '#5487e0',
        margin: 20,
        justifyContent: 'center',
        borderRadius:5
    },
    loginText: {
        fontSize: 17,
        alignSelf: 'center',
        color: '#FFF',
    },
    regStyle:{
        flex: 1,
        flexDirection: 'row',
        justifyContent:'flex-end',
        paddingRight:10,
    },
    lableStyle:{
        marginTop:10,
        marginBottom:10
    }

})
