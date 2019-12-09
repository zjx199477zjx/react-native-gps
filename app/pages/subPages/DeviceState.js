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
    Easing,
    ImageBackground,
}from 'react-native'
import ajax from '../../utils/requestAjax';
import Toast, {DURATION} from 'react-native-easy-toast';
import Header from '../../components/LoginHeader';
import moment from 'moment';
import MD5 from "react-native-md5";
import Storage from '../../Storage';
import JPushModule from '../../NotifService'

const {width: sreenWidth, height: screenHeight} = Dimensions.get('window');
const deviceThumb =require('./../../../assets/images/p1.png');
const deviceThumbNative =require('./../../../assets/images/p1_1.png');
const loading =require("./../../../assets/images/i_loading.gif");


export default class DeviceState extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            onload:true,
            refreshing:false,
            flatHeight: 200,
            listData:[],
            length:0,
            userInfo:{},
            RegistrationID:'',
            loadText:'Loading...'
        }
    }
    currPage = 1;
    is_load=false;

    // 获取缓存数据
    getStorage(){
        if(!global.storage) return {};
        let cache =(global.storage.cache || {}).userInfo;
        if(cache) return (cache.rawData || {}).userInfo;
        return {};
    }
    _qureyStore(key,cb){
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

    nextRequest(jsonData,userInfo){
        let _this =this;
        ajax({
            url:`https://ac-link.com/webapi/get_message_log`,
            method:'POST',
            data:jsonData,
            success: (data) => {
                if(data.ret == 1){
                    var length = (data.data.list || []).length > 0 ? (data.data.list || []).length : 0;
                    // 首次进来无数据的处理
                     if(_this.currPage == 1 && length <= 0){
                         _this.setState({
                             length:length,
                             loadText:false,
                             refreshing:false
                         })
                         _this.is_load=false;
                         return;
                     }

                    _this.setState({
                        listData:_this.state.refreshing? data.data.list: [..._this.state.listData,...data.data.list],
                        length:length
                    });
                    _this.currPage += 1;
                     
                    _this.is_load=false;
                    _this.state.refreshing && _this.setState({refreshing: false});
                    if(length == 0) return _this.refs.toast.show('No more data');
                    return;
                }

                // if(data.err_msg || data.errMsg || data.msg)
                if(data.errCode == 3){
                    // _this.automaticLogin(userInfo,(user)=>{
                    //     _this._getNewList(user);
                    // })
                    _this.props.navigation.push('Login',{link:'Me',userInfo:userInfo});
                    return;
                }
                 _this.is_load=false;
                _this.state.refreshing && _this.setState({refreshing: false});
                
                // if(data.err_msg || data.errMsg || data.msg)
            },
            error: (err) => {
                 _this.refs.toast.show('Network error');
                  _this.is_load=false;
                _this.state.refreshing && _this.setState({refreshing: false});
            },
            
        });
    }

   _getNewList(user){
       if(this.is_load && !user) return;
       this.is_load=true;

       let _this = this;
        
        // const userInfo =user || _this.getStorage();
        // if(!userInfo.yunid){
        //     _this.refs.toast.show('Please login first');
        //     return _this.props.navigation.push('Login',{link:'Me'});
        // }  
        _this._qureyStore('loginSave',(data)=>{
             if(!data.yunid || data.is_exit){
                const userInfo =_this.getStorage();
                if(userInfo.yunid){
                    let jsonData ={item:'device',yunid:userInfo.yunid,sid:userInfo.sid,min:_this.currPage,max:20};
                    return _this.nextRequest(jsonData,userInfo);
                }
                _this.refs.toast.show('Please login first');
                return _this.props.navigation.push('Login',{link:'Me'});
             }else{
                let jsonData ={item:'device',yunid:data.yunid,sid:data.sid,min:_this.currPage,max:20};
                 _this.nextRequest(jsonData,data);
             }
        })
        // 测试会话过期
        // if(!user)userInfo.sid='f0322fe479895d718973aa6dea08f21e'
        
       
   }
    //上拉加载更多
    _onEndReached = () => {
        if (this.isCanLoadMore && this.onEndReached) {
            this._getNewList();
            this.isCanLoadMore = false;
        }
    }
    //下拉刷新
    _renderRefresh = () => {
        // this.is_load=false
        this.setState({refreshing: true,loadText:'Loading...'}); //开始刷新
        this.currPage = 1;
        this._getNewList();
        
    }

    componentDidMount(){
        let _this=this;
        _this.is_load=false
        _this._getNewList();
        setTimeout(() => {
            _this.onEndReached=true
        },300);
    }


    // 自动登录方式
     automaticLogin(user,callback){
        let yunid =user.login_id || user.yunid;
        if(!yunid || !user.userpwd) return;
        let passwd =MD5.hex_md5('mq' + yunid + user.userpwd);
        ajax({
            url: `https://ac-link.com/webapi/login?login_id=${yunid}&passwd=${passwd}`,
            method:'POST',
            success: (data) => {
                if(data.ret == 1){
                    const userInfo =data.data;
                    if(!userInfo) return;
                    userInfo.userpwd=user.userpwd;
                    // 加入本地缓存
                    Storage.save({
                        key: 'userInfo',
                        data: {
                            userInfo: userInfo,
                        },
                        //expires为有效时间
                        expires: 1000* 500000
                    })
                    callback && callback(userInfo);
                }

 
            }
        });
    }


    //Footer视图
    _renderFooter  = () => {
        let len = this.state.length;
        return(
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:len<1?0:40}}>
                <Image source={loading} resizeMode={'contain'} style={{width:20, height:20, marginRight: 5, height:len<1?0:40}} />
                <Text style={{color:'#515151'}}>Loading...</Text>
            </View>
        )
    }

    //分割线
    _renderItemSeparatorComponent = ({highlighted}) => {
        return(
            <View style={{height:1, backgroundColor:'#e6e6e6'}}></View>
        )
    }

     //没有数据时候页面显示
    _renderEmptyView = () => {
        let loadText =this.state.loadText;
        // let img =!loadText ?
        return(
            <View style={{height:this.state.flatHeight,  justifyContent:'center', alignItems:'center', marginTop:120}}>
                {!loadText ? null : <Image source={loading} resizeMode={'contain'} style={{width:30, height:30}} />}
                {/* <Text>暂无数据</Text> */}
                 <Text style={{color:'#515151'}}>{loadText || 'Temporarily no data'}</Text>
            </View>
        )
    }

     /**
     * 此函数用于为给定的item生成一个不重复的key
     * key的作用是使React能够区分同类元素的不同个体，以便在刷新的时候能确定其变化的位置，减少重复渲染的开销
     * 若不指定此函数，则默认抽取item.key作为key值，若key.item不存在，则使用数组下标
     *    // selected={this.state.selected === item.id}
     */
    _keyExtractor = (item, index) => index + '';

    // 渲染列表
    _renderItem = ({item}) => {
        return(
            <HomeFlatListItem 
                item={item}
                onPressItem={this._onPressItem}
              
            />
        )
    }
    _onPressItem = (item) => {
        return;
    }
    _toastShowAleat =(text) =>{
        if(!text) return;
        this.refs.toast.show(text);
    }

    render(){
        return(
           
             <View style={styles.container}>
                    <Header  navigation={this.props.navigation} centerText={'Device Notification'} load={true} refLoad={this._toastShowAleat}/>
                    {/* <ScrollView> */}
                        <FlatList 
                            ref={ref => this.flatList = ref}
                            data={this.state.listData}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            //初始加载的条数，不会被卸载
                            initialNumToRender={20}
                            //决定当距离内容最底部还有多远时候触发onEndReached回调，数值范围:0~1。例如:0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                            onEndReachedThreshold={0.5}
                            //当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用此函数
                            onEndReached={this._onEndReached}
                            // ListHeaderComponent={ null}
                            ListFooterComponent={this._renderFooter}
                            ItemSeparatorComponent={this._renderItemSeparatorComponent}
                            ListEmptyComponent={this._renderEmptyView}
                            // onLayout={this._setFlatListHeight}
                            removeClippedSubviews={true}
                            //正在加载的时候设置为true，会在界面上显示一个正在加载的提示
                            refreshing={this.state.refreshing}
                            //如果设置了此选项，则会在列表头部添加一个标准的RefreshControl控件，以便实现“下拉刷新”的功能。同时你需要正确设置refreshing属性。
                            onRefresh={this._renderRefresh}
                            onContentSizeChange={() => {
                                this.isCanLoadMore = true // flatview内部组件布局完成以后会调用这个方法
                            }}
                        />
                    {/* </ScrollView> */}
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
class HomeFlatListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.item)
    }
    render(){
        
        let item = this.props.item;
        
        let object={};
        try{
            object=JSON.parse(item.content);
        }catch(err){
            
        }
        let is_online=object.errcode == '301'? deviceThumbNative :deviceThumb;
        let time =moment(+object.time * 1000).format("YYYY-MM-DD HH:mm:ss");
        return(
             <TouchableOpacity 
                    {...this.props}
                    onPress={this._onPress}
                    style={styles.picItem}
                    activeOpacity={0.8}
                >
                 <View style={{justifyContent:'space-between',flexDirection:'row',padding:15}}>
                        <View style={styles.cell}>
                            <Text style={styles.text}>Device State:{object.title}</Text>
                            <Text style={styles.text}>Time:{time? time : ''}</Text>
                            <Text style={styles.text}>Mac:{object.name || ''}</Text>
                            <Text style={styles.text}>{object.location? `Location:${object.location}`:''}</Text>
                        </View>
                        <View style={styles.cellWidth}>
                            <Image source={is_online} resizeMode={'contain'} style={{width:40, height:40,marginTop:20, marginLeft:5}} />
                        </View>
                </View>
            </TouchableOpacity>
        )   
    }
}
const styles =StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F8F8F8',
        overflow:'hidden',
    },
    item:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 7,
    },
    picItem:{
        padding: 7,
    },
    cellWidth:{
        width:50,
    },
    cell:{
        flex:1,
        
        alignItems: 'flex-start'
    },
    cell2:{
        flexDirection:'row',
        flex:1
    },
    text:{
        fontSize:17
    }

})
