import React, { PureComponent } from 'react';
import { View, Text, Dimensions,TouchableOpacity } from 'react-native';
import MapView,{ PROVIDER_GOOGLE,Callout,Marker } from 'react-native-maps';
import ajax from '../utils/requestAjax';

let {width,height} = Dimensions.get('window');
let key ='AIzaSyBmyGCVnYEzxX2T9tLiFeyCLTrgAy68M-Y';
export default class MyMap extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            region:{
                latitude: 20.9948891,
                longitude: 105.799677,
                latitudeDelta: 20,
                longitudeDelta:20,
            },
            deviceInfo:{},
            title:'device1',
            description1:'',
            description2:'',
            apiTime:5000,
            isCalloutShow:false
        }
    }
    MapType= {
        type1:"standard",
        type2:"satellite",
        type3:"hybrid",
        type4:"terrain" //Android only
    }

    is_start_load=false;

    componentWillReceiveProps(nextProps){
        if(!nextProps.region) return;

        const device =nextProps.device;
        this.setState({
            region:nextProps.region,
            deviceInfo:device,
            title:device.sn || device.mac || ''
        })
        // 获取地址位置信息
        this.addressInfo(nextProps.region);

        // 定时加载经纬度
        this.timeLoadData(device);
    }

    // 地址位置信息展示
    addressInfo(region){
        const _this =this;
        // en-US
        ajax({
			url:`https://maps.google.cn/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&sensor=false&language=en-US&key=${key}`,
			type:"GET",
			success:(res) =>{
                res = res || {};
                const results =res.results || [],
                      addressObj =results[1] || {},
                      formatted =results[0] || {},
                      address =addressObj.formatted_address || '',
                      formatted_address=formatted.formatted_address || '';

                _this.setState({
                    description1:address,
                    description2:formatted_address,
                    isCalloutShow:true
                })
                 _this.showCallout();
			},
			error:(err) =>{

			}
		})
    }

    // 重复调用数据
    repeatLoadData(device){
        let _this =this;
        if(!_this.is_start_load) return;
        _this.timeLoadData(device);
        
    }
    
    pythens =1;
    timer=null;
    // 开始调用数据
    timeLoadData(device){
        clearTimeout(this.timer)
        this.pythens++
        let _this =this;
        ajax({
            url:`https://ac-link.com/webapi/getAccountGps?item=device&mac=${device.sn || device.mac}&max=2`,
            type:'GET',
            success:(res) =>{
                // if(res.ret != 1 || (res.data || []).length <= 0) return  _this.showCallout();
                let latlng =res.data[0] || '';
                if(latlng.indexOf('%') > 0){
                    latlng =(latlng.split("%"))[0];
                } 
                if(latlng.indexOf(",") > 0){
                     latlng =latlng.split(",");
                }
                
                if(latlng){

                    let regionArray ={
                                latitude: +latlng[0],
                                longitude: +latlng[1],
                                latitudeDelta:0.03,
                                longitudeDelta:0.03
                             };
                    _this.setState({
                         region:regionArray,
                         title:device.sn || device.mac
                    })
                    _this.is_start_load=true;
                    _this.addressInfo(regionArray);
                   
                    _this.timer=setTimeout(() => {
                        _this.repeatLoadData(device)
                    }, _this.state.apiTime || 5000);
                }
            },
            error:(err) =>{
            }
        })
    }

    showCallout(){
        // 开启标注显示
        let _this =this;
        setTimeout(()=>{
            if(_this.pickUpMarker){
                _this.pickUpMarker.showCallout();
            }
        },500)
        
    }

    hideCallout(){
        if(this.pickUpMarker){
            this.pickUpMarker.hideCallout();
        }
    }

    componentWillMunit(){
        this.hideCallout();
    }
    
    // 监听页面卸载
    componentWillUnmount(){
        // console.log("map 页面卸载")
        this.is_start_load=false;
        clearTimeout(this.timer);
        clearTimeout(this.loadData)
    }


    // 拖动地图时，禁止刷新地图12秒
    setTimeoutLoadData(){
        const device =this.state.deviceInfo;   
        this.loadData =setTimeout(()=>{
            this.timeLoadData(device)
        },5000)
    }

    // 用户拖动地图时 方法处理
    mapsRegionChange =(map) =>{
        if(this.loadData){
            clearTimeout(this.loadData);
            this.setTimeoutLoadData();
        } 
        if(!this.is_start_load) return;
        this.is_start_load=false;

        if(!this.state.deviceInfo.gps_location) return;
        this.setTimeoutLoadData();   
    }


    
    render() {
        return (
            <View style={styles.container}>
                <MapView 
                    style={{flex: 1,width:width}} 
                    initialRegion={this.state.region}
                    provider={PROVIDER_GOOGLE}
                    mapType={this.MapType.type1}
                    region={this.state.region}
                    onRegionChange={this.mapsRegionChange}
                    
                    >
                    <Marker 
                        coordinate={this.state.region}
                        pinColor={'blue'}
                        ref={ref => this.pickUpMarker = ref}
                        tracksViewChanges={false}  
                    >
                        
                        <Callout 
                            tooltip={true} 
                            > 
                            <View style={styles.infoBox}>
                                {/* <Text style={styles.remove}> X </Text> */}
                                <Text style={styles.infoTitle}>{this.state.title? `MAC: ${this.state.title}` : ''}</Text>
                                <Text style={styles.callout}>{this.state.region.latitude? `Latitude: ${this.state.region.latitude}`:''}</Text>
                                <Text style={styles.callout}>{this.state.region.longitude? `Latlng: ${this.state.region.longitude || ''}`:''}</Text>
                                <Text style={styles.callout}>{this.state.description1? `Location: ${this.state.description1}`:''}</Text>
                                <Text style={styles.callout}>{this.state.description2? `Close to the location: ${this.state.description2}`:''}</Text>
                            </View>
                        </Callout>
                     </Marker>
                        
                </MapView>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width:width,
        height:100
    },
    text: {
        fontSize: 30,
        fontWeight: '700',
        color: '#59656C',
        marginBottom: 10,
    },
    infoBox:{
        position:'relative',
        backgroundColor:'#fff',
        padding:15,
        borderRadius:5,
        marginHorizontal: 5, 
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    remove:{
        position:'absolute',
        right:10,
        top:5,
        fontSize:18
    },
    infoTitle:{
        flexWrap: 'nowrap'
    },
    callout:{
        flexWrap: 'wrap',
        maxWidth:width-30,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
};
