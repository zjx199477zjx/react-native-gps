import React, { PureComponent } from 'react' 
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    Animated,
    Dimensions,
    ImageBackground,
     NativeModules
}from 'react-native'
import Header from '../../components/LoginHeader';

const {width: sreenWidth, height: screenHeight} = Dimensions.get('window');
export default class About extends PureComponent{
    constructor(props){
        super(props);
        this.state={
        }
    }

      _onPressItem =(item) => {
        // 打开设备列表
        if(item['privacy']){
            const navigation =this.props.navigation.push;
            navigation('Privacy')
            return 
        }


    }

     settingData = [
        {
            leftText: 'Privacy Policy',
            privacy:true,
            isHide:false

        }
       
    ]
    render(){
        return(
            <View style={styles.mainCss}>
                <Header  navigation={this.props.navigation} centerText={'About Us'}/>
                 <TouchableOpacity 
                    item={this.state} 
                    onPress={this.login} >
                    <View style={styles.headCenterContainer}>
                        <Animated.Image style={styles.userImg}  source={require('./../../../assets/images/logo.png')} resizeMode={'contain'} />

                        {/* <Animated.Text style={styles.userNickname}>{loginInfo.tel || loginInfo.yunid || 'Not logged in'}</Animated.Text> */}
                        <Text>Version: 1.2 (Build 19.1130.193035)</Text>
                    </View>
                </TouchableOpacity>
                 {/* 过渡条 */}
                {/* <View style={styles.transitionView}></View> */}

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
            </View>
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
                        !this.props.rightComponent && this.props.isShowArrow && <Image style={styles.itemRightImg} source={require('./../../../assets/images/i_right.png')}/>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}

const styles =StyleSheet.create({
    mainCss:{
        width:sreenWidth,
        height:screenHeight,
        backgroundColor:'#FFFFFF'
    },
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
        paddingLeft:10,
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
    transitionView: {
        height: 5,
        backgroundColor: 'rgba(230,230,230, .5)'
    },
    settingListContainer: {
        // paddingLeft: 20,
    }
})
