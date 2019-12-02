import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    BackAndroid
} from 'react-native';
import StackNavigtor from 'react-navigation';
import MyMap from './../googleMap/GoogleMaps';
import Header from './../googleMap/OverlayComponent'
// import JPushModule from '../NotifService'
const {width,height} = Dimensions.get('window');

export default class Location extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            latlng:null,
            deviceInfo:{}
        }
    }

    componentDidMount(){
        let  _this =this;
        const params =_this.props.navigation.state.params || {}
        if(params.gps_location){
            if(params.gps_location.indexOf(',') < 0) return;
            const array = (params.gps_location || '').split(",");
            _this.setState({
                latlng:{latitude:+array[0],longitude:+array[1],latitudeDelta:0.03,longitudeDelta:0.03},
                deviceInfo:params
            })
            // console.log(array)
        }
    }
    // 为了避免内存泄漏 卸载之前必须调用此方法
    PreeClose(){

    }


    render(){
        // console.log(this.state.latlng)
        let device =this.state.deviceInfo.sn? <Header navigation={this.props.navigation} centerText={this.state.deviceInfo.sn} /> :null;
        return (
            <View style={styles.container}>
                {device}
                <MyMap 
                    style={styles.map}
                    region={this.state.latlng}
                    device={this.state.deviceInfo}
                    />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});
// import SimpleMap from '../MapsViewDom';
// <SimpleMap/>