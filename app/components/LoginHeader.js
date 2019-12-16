import React, { PureComponent } from 'react'
import {
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    Text,
    View,
    Switch
} from 'react-native'
import Toast, {DURATION} from 'react-native-easy-toast';
import JPushModule from '../NotifService'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window')

export default class LoginHeader extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            trueSwitchIsOn:false
        }
    }
    static defaultProps= {
        leftText:'',
        centerText:'Login',
    }

     componentDidMount(){
        
        let _this =this;
        // 初始化
        JPushModule.initLients(() => {
            // 跳转回调
            _this.props.navigation.push("DeviceState");
        });
        
        if(this.props.load){
            JPushModule.queryLients((data) =>{
                let object=data.data[0] || {};
                _this.setState({
                    trueSwitchIsOn:object.push_state=='1'? true:false
                })
            })
        }
        
     }


    onValueChangeEvent =(value)=>{
        let _this =this;
        _this.setState({
            trueSwitchIsOn: value
        })
        if(value){
            _this.openJPush();
        }else{
            _this.colseJPush();
        }
        _this.props.refLoad(value? 'Open the notification':'Close to inform');
    }

    // 开启消息推送
    openJPush(){
        let _this =this;
        JPushModule.startLients();
        JPushModule.openLients();
    }

    // 关闭消息推送
    colseJPush(){
        let _this =this;
        JPushModule.colseLients();
    }

// (value) => 
    render(){
        return(
            <View style={styles.headerContainer}>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection: 'row', alignItems:'center', flex: 1}} onPress={()=>{this.props.link? this.props.navigation.navigate('Me'):this.props.navigation.goBack()}} >
                    <Image source={require('./../../assets/images/i_goback.png')} resizeMode={'contain'} style={styles.headerLeftImg} />
                    <Text style={{color: 'white', fontSize: 16}}>{this.props.leftText}</Text>
                </TouchableOpacity>

                <View style={styles.headerCenterContainer}>
                    <Text style={styles.headerCenterText}>{this.props.centerText}</Text>
                </View>

                {/* 为了让标题居中 */}
                <View style={{height: 25,width: 25,justifyContent: 'center', flex: 1} }/>
                {this.props.load? <Switch
                    onValueChange={this.onValueChangeEvent}
                    value={this.state.trueSwitchIsOn} />:null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#5487e0',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        paddingTop: 25,
    },
    headerLeftImg: {
        width:25,
        height:25,
        marginLeft:10,
    },
    headerCenterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        flex: 4,
    },
    headerCenterText: {
        fontSize: 18,
        color: '#ffffff',
    },
    headerRightImg: {
        width: 40,
        height: 40,
    },
})