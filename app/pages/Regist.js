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
    TouchableOpacity,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import LoginHeader from './../components/LoginHeader';
import MD5 from "react-native-md5";
import ajax from './../utils/fetch';
import { LANG_CODE } from './../utils/config';
import CheckBox from 'react-native-checkbox';

export default class Regist extends PureComponent{
    constructor(porps){
        super(porps)
        this.state={
            newsData: '',
            body: '',
            checked:false,
        }
    }

    loginInMainpage() {
        // this.refs.inputLoginName.blur();
        // this.refs.inputLoginPwd.blur();
        const _this =this;
        const username =_this.refs.inputLoginName._lastNativeText || '';
        const pass1 =_this.refs.inputLoginPwd._lastNativeText || '';
        const pass2 =_this.refs.inputLoginPwd2._lastNativeText || '';
        const name =_this.refs.inputName._lastNativeText || '';
        if(!username) return _this.refs.toast.show('username Cant be empty');
        if(!pass1 || !pass2) return _this.refs.toast.show('passwd Cant be empty');
        if(!pass1 != !pass2) return _this.refs.toast.show('Incorrect password entered twice');
        if(!name) return _this.refs.toast.show('name Cant be empty');

        const md5Pass =MD5.hex_md5('mq' + username + pass1);
        const userInfo ={tel:username,userpwd:pass1,yunid:username,passwd:md5Pass,realname:name};
        ajax({
            url: `https://ac-link.com/webapi/register?tel=${username}&passwd=${md5Pass}&yunid=${username}&realname=${name}`,
            method:'GET',
            success: (data) => {
                if(data.ret == 1){
                     _this.refs.toast.show('register success');

                    setTimeout(() => {
                        _this.props.navigation.navigate('Login',userInfo); 
                    }, 1000);
                    return;
                }
                 var err_msg;
                 if (!err_msg) err_msg = data.errCode != undefined ? LANG_CODE["errcode"+data.errCode] : data.msg;
                _this.refs.toast.show(err_msg);
 
            },
            error: (err) => {
                // _this.refs.toast.show('Network request exception');
                _this.refs.toast.show('Error: network request failed. Please turn on Cellular Data or use Wi-Fi network. and check Settings -> Sphere WIFI GPS -> Wireless Data , allow "WLAN & Cellular Data"',15000)
            }
        })

    }


    // 隐私政策跳转
    navigatePrivacy=()=>{
       const  navigation= this.props.navigation.push;
       navigation('Privacy');
    }

    onCheckUpdate =(state)=>{
        this.setState({
            checked:!state
        })
    }


    render(){
        return (
            <View style={styles.container}>
                <LoginHeader navigation={this.props.navigation} centerText={"Create Account"} />
                {/* <ScrollView style={styles.boxRes}> */}
                    <View style={styles.item}><Text style={styles.textStyle}>Username:</Text>
                        <TextInput
                            ref="inputLoginName"
                            autoFocus={true}
                            underlineColorAndroid="gray"
                            placeholder="Please enter username"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1,lineHeight:40}}
                            // onChangeText={(input) => this.setState({username: input})}
                        ></TextInput>
                    </View>
                    <View style={styles.item}><Text style={styles.textStyle}>Password:</Text>
                        <TextInput
                            ref="inputLoginPwd"
                            underlineColorAndroid="gray"
                            placeholder="Password is required"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            secureTextEntry={true}
                            style={{flex: 1,lineHeight:40}}
                            // onChangeText={(input) => this.setState({userpwd: input})}
                            ></TextInput>
                    </View>
                     <View style={styles.item}><Text style={styles.textStyle}>PassWord:</Text>
                        <TextInput
                            ref="inputLoginPwd2"
                            underlineColorAndroid="gray"
                            placeholder="Please confirm your password"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            secureTextEntry={true}
                            style={{flex: 1,lineHeight:40}}
                            // onChangeText={(input) => this.setState({userpwd2: input})}
                            ></TextInput>
                    </View>
                    <View style={styles.item}><Text style={styles.textStyle}>Alias Name:</Text>
                        <TextInput
                            ref="inputName"
                            // autoFocus={true}
                            underlineColorAndroid="gray"
                            placeholder="Please enter alias name"
                            // clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1,lineHeight:40}}
                            // onChangeText={(input) => this.setState({name: input})}
                        ></TextInput>
                    </View>
                    <TouchableHighlight 
                        style={[styles.login,{backgroundColor: this.state.checked? '#5487e0':'#c2c2c2'}]}
                        underlayColor='#c2c2c2'
                        disabled={!this.state.checked}
                        onPress={()=>this.loginInMainpage()}
                        >
                         <Text style={styles.loginText}>Create an Account</Text>
                    </TouchableHighlight>
                    <View style={styles.privacyBox}>
                        <CheckBox
                            label={null}
                            checked={this.state.checked}
                            labelBefore={true}
                            labelStyle={styles.lableStyle}
                            onChange={this.onCheckUpdate}
                        />
                        <Text style={styles.privacyFont}> Click here to indicate that you have read and agree to the 
                            <Text 
                                style={styles.privacy}
                                onPress={this.navigatePrivacy}
                                > Privacy policy</Text>
                        </Text>
                    </View>
                {/* </ScrollView> */}
                 <Toast
                    ref='toast'
                    style={{backgroundColor:'black'}}
                    position='center'
                    delay={5000}
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
    boxRes:{
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
        justifyContent:'flex-end',
    },
    privacyBox:{
        paddingLeft:20,
        paddingRight:20,
        flexDirection: 'row',
        flex: 1,
    },
    privacyFont:{
        fontSize:18,
        lineHeight:28,
    },
    privacy:{
        color:'#476490',
    },
    lableStyle:{
        width:30
    }

})
