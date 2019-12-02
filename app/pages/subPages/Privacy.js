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
}from 'react-native';
import Header from '../../components/LoginHeader'


export default class Privacy extends PureComponent{
    constructor(props){
        super(props)
        this.state={

        }
    }
 
    render(){
        return(
            <View>
                <Header navigation={this.props.navigation} centerText={'Privacy Policy'} />
                <ScrollView style={styles.mian}>
                    <Text style={styles.title}>Privacy Policy</Text>
                    <View style={styles.content}>
                    
                        <Text style={styles.text}>Sphere built the Sphere WiFi GPS app as a Commercial app. This SERVICE is provided by Sphere and is intended for use as is.</Text>
                        <Text style={styles.text}>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</Text>
                        <Text style={styles.text}>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</Text>
                        <Text style={styles.text}>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Sphere WiFi GPS unless otherwise defined in this Privacy Policy.</Text>
                        <Text style={styles.text}>Information Collection and Use</Text>
                        <Text style={styles.text}>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information. The information that we request will be retained by us and used as described in this privacy policy.</Text>
                        <Text style={styles.text}>Log Data</Text>
                        <Text style={styles.text}>We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</Text>
                        <Text style={styles.text}>Cookies </Text>
                        <Text style={styles.text}>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</Text>
                        <Text style={styles.text}>This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</Text>
                        <Text style={styles.text}>Service Providers </Text>
                        <Text style={styles.text}>We may employ third-party companies and individuals due to the following reasons: </Text>             
                        <View style={styles.ViewText}>
                                <Text style={styles.view}>To facilitate our Service;</Text>
                                <Text style={styles.view}>To provide the Service on our behalf; </Text>
                                <Text style={styles.view}>To perform Service-related services; or</Text>
                                <Text style={styles.view}>To assist us in analyzing how our Service is used. </Text>
                        </View>
                        <Text style={styles.text}>We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</Text>
                        <Text style={styles.text}>Security</Text>
                        <Text style={styles.text}>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</Text>
                        <Text style={styles.text}>Links to Other Sites</Text>
                        <Text style={styles.text}>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</Text>
                        <Text style={styles.text}>Contact Us</Text>
                        <Text style={styles.text}>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at Sphere.</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles =StyleSheet.create({
    mian:{
        padding:10
    },
    title:{
        textAlign: 'center',
        fontWeight: 'bold',
        borderColor: '#1ec689',
        borderRadius: 0.5,
        borderWidth: 1,
        borderStyle: 'dotted',
        backgroundColor:'#effef9',
        color:'#000',
        marginBottom:20,
        fontSize:18,
        lineHeight:50,
    },
    content:{
        borderColor: '#1ec689',
        borderRadius: 0.5,
        borderWidth: 1,
        borderStyle: 'dotted',
        backgroundColor:'#effef9',
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:8,
        paddingRight:8,
        marginBottom:60,
    },
    text:{
        marginBottom:20,
        flexDirection: 'column',
        flexWrap: 'wrap',
        fontSize:17,
        lineHeight:28,
        
    },
    ViewText:{
        marginBottom:20,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    view:{
        marginBottom:5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        fontSize:17,
        lineHeight:28,
    }
})