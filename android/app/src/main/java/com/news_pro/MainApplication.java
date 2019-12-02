package com.news_pro;

import android.app.Application;

import com.facebook.react.ReactApplication;
// import com.brentvatne.react.ReactVideoPackage;
// import com.github.yamill.orientation.OrientationPackage;
import com.airbnb.android.react.maps.MapsPackage;

import cn.jiguang.plugins.push.JPushPackage;

// import com.github.yamill.orientation.OrientationPackage;
// import com.brentvatne.react.ReactVideoPackage;
import com.airbnb.android.react.maps.MapsPackage;  // INSERT THIS LINE
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage; //insert  NativePushNotification
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import cn.jiguang.plugins.push.JPushModule;
 


public class MainApplication extends Application implements ReactApplication {
   // 设置为true将不弹出toast
  // private boolean SHUTDOWN_TOAST = false;
  // // 设置为true将不打印log
  // private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            // new ReactVideoPackage(),
            // new OrientationPackage(),
            new MapsPackage(),
            new JPushPackage()
//          new ReactNativePushNotificationPackage() // <---- Add the Package
            // new OrientationPackage(),
            // new ReactVideoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
     //调用此方法：点击通知让应用从后台切到前台
    JPushModule.registerActivityLifecycle(this);
  }
}
