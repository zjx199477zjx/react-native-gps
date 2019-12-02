import React, { PureComponent } from 'react' 
import {
    FlatList,
    TouchableOpacity,
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    Button,
    View,
    Alert,
    Image,
    ScrollView,
    AsyncStorage,
    Animated,
    TextInput,
    Easing,
    ImageBackground,
    TouchableHighlight,
}from 'react-native'
import ajax from '../../utils/requestAjax';
import Toast, {DURATION} from 'react-native-easy-toast';
import Header from '../../components/LoginHeader';
import moment from 'moment';
import MD5 from "react-native-md5";
import Storage from '../../Storage';
// import ajax from './../../utils/requestAjax';


export default class Userinfo extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            userinfo:{}
        }
    }

    saveInMainpage =()=>{
        let _this =this;
        const realname =_this.refs.realname._lastNativeText || this.state.userinfo.realname;
        // const qq =_this.refs.qq._lastNativeText || this.state.userinfo.qq;
        // const email =_this.refs.email._lastNativeText || this.state.userinfo.email;
        // const company =_this.refs.company._lastNativeText || this.state.userinfo.company;
        // qq:qq,email:email,company:company,

        if(!_this.state.userinfo.yunid) return _this.refs.toast.show("yunid is not find")
        const data ={item:'device',realname:realname,yunid:this.state.userinfo.yunid};
        ajax({
            url:'https://ac-link.com/webapi/gpsAppUserInfoEdit',
            method:'POST',
            data:data,
            success: (data) =>{
                if(data.ret == 1){
                     _this.refs.toast.show('save success');
                }else{
                    _this.refs.toast.show(data.errMsg);
                }
                
            },
            error:(err) =>{
               _this.refs.toast.show('Network error')
            }


        })
    }

    // 回去用户信息
    componentDidMount(){
        let _this =this;
        let userinfo =(((_this.props.navigation || {}).state || {}).params || {}).userInfo || {};
        let yunid =userinfo.yunid;
        ajax({
            url:`https://ac-link.com/webapi/getAppUserInfo?item=device&yunid=${yunid}`,
            method:'GET',
            success:(data)=>{
                userinfo =data.data[0];
                if(!userinfo) return _this.refs.toast.show("数据异常");
                if(data.ret == 1){
                    _this.setState({
                        userinfo:userinfo
                    })
                }
            },
            error:(data) =>{
               _this.refs.toast.show('Network error')
            }
        })
    }

    render(){
        let userinfo =this.state.userinfo;
        let time =moment(+userinfo.logintime * 1000).format("YYYY-MM-DD HH:mm:ss");
        return(
            <View style={styles.container}>
                <Header  navigation={this.props.navigation} centerText={'Userinfo'} />
                <ScrollView style={styles.container}>
                    {/* 头部 */}
                    <View style={styles.headContainer}>

                        {/* 头像、昵称、标签 */}
                        <TouchableOpacity>
                            <View style={styles.headCenterContainer}>
                                <Animated.Image style={styles.userImg}  source={require('./../../../assets/images/nickThumb.png')} resizeMode={'contain'} />

                                <Animated.Text style={styles.userNickname}>{userinfo.yunid || ''}</Animated.Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    {/* 过渡条 */}
                    <View style={styles.transitionView}></View>

                    {/* 设置列表 */}
                    <View style={styles.settingListContainer}>
                        <View>
                            <View><Text style={styles.textName}>Your name:</Text></View>
                            <View>
                                <Text style={styles.inputStyle}>{userinfo.realname ||''}</Text>
                                {/* <TextInput
                                    ref="realname"
                                    style={styles.inputStyle}
                                    placeholder="Your name"
                                    autoCapitalize='none'
                                    clearButtonMode="while-editing"
                                    textDecorationLine='none'
                                    // editable={false}
                                    underlineColorAndroid='transparent'
                                    >{userinfo.realname ||''}</TextInput> */}
                            </View>
                        </View>
                        {/* <View>
                            <View><Text style={styles.textName}>QQ：</Text></View>
                            <View>
                                <TextInput
                                    ref="qq"
                                    style={styles.inputStyle}
                                    placeholder="Your QQ"
                                    autoCapitalize='none'
                                    clearButtonMode="while-editing"
                                    textDecorationLine='none'
                                    // editable={false}
                                    underlineColorAndroid='transparent'
                                    >{userinfo.qq || ''}</TextInput>
                            </View>
                        </View> */}
                        {/* <View>
                            <View><Text style={styles.textName}>email：</Text></View>
                            <View>
                                <TextInput
                                    ref="email"
                                    style={styles.inputStyle}
                                    placeholder="Your email"
                                    autoCapitalize='none'
                                    clearButtonMode="while-editing"
                                    textDecorationLine='none'
                                    // editable={false}
                                    underlineColorAndroid='transparent'
                                    >{userinfo.email || ''}</TextInput>
                            </View>
                        </View>
                        <View>
                            <View><Text style={styles.textName}>Company：</Text></View>
                            <View>
                                <TextInput
                                    ref="company"
                                    style={styles.inputStyle}
                                    placeholder="Your company"
                                    autoCapitalize='none'
                                    clearButtonMode="while-editing"
                                    textDecorationLine='none'
                                    // editable={false}
                                    underlineColorAndroid='transparent'
                                    >{userinfo.company || ''}</TextInput>
                            </View>
                        </View> */}
                        <View>
                            <View><Text style={styles.textName}>Last login:</Text></View>
                            <View>
                                <Text style={styles.inputStyle}>{time || ''}</Text>
                                {/* <TextInput
                                    ref="logintime"
                                    style={styles.inputStyle}
                                    placeholder="Last login time"
                                    autoCapitalize='none'
                                    clearButtonMode="while-editing"
                                    textDecorationLine='none'
                                    editable={false}
                                    underlineColorAndroid='transparent'
                                    >{time || ''}</TextInput> */}
                            </View>
                        </View>
                    </View>
                     {/* <TouchableHighlight 
                        style={styles.styleBtn}
                        underlayColor='#c2c2c2'
                        onPress={()=>this.saveInMainpage()}
                        >
                            <Text style={styles.loginText}>save</Text>
                    </TouchableHighlight> */}
                </ScrollView>
                <Toast
                        ref='toast'
                        style={{backgroundColor:'black'}}
                        position='center'
                        opacity={0.8}
                        textStyle={{color:'white'}}
                    />
            </View>
        )   
    }


}   

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    itemBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    itemLeftText: {
        fontSize: 14,
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
        marginRight: 5
    },
    headTopText: {
        fontSize: 12,
        color: '#515151'
    },
    headCenterContainer: {
        alignItems: 'center',
        marginBottom: 15
    },
    userImg: {
        width: 80,
        height: 80,
        borderRadius: 40
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
    textName:{
        backgroundColor: '#f8f8f8',
        color: '#666',
        fontWeight:'bold',
        lineHeight:40,
        fontSize:17
    },
    bottomBtn: {
      alignItems: 'center'
    },
    bottomNum: {
        fontSize: 18,
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
        paddingLeft: 10,
        paddingRight:10,
    },
    inputStyle:{
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#fff',
        paddingLeft:5,
        paddingRight:5,
        borderRadius:5,
        color:'#333',
        lineHeight:50,
        height:50,
    },
    styleBtn:{
        height: 50,
        backgroundColor: '#5487e0',
        margin: 20,
        justifyContent: 'center',
        borderRadius:5,
        alignItems: 'center',
    },
    loginText:{
        color:"#fff",
        fontSize:20
    }
})
