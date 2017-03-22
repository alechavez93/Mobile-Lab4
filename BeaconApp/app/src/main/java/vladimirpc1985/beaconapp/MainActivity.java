package vladimirpc1985.beaconapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.bluetooth.BluetoothDevice;
import android.os.ParcelUuid;
import android.util.Log;
import android.content.pm.PackageManager;

import vladimirpc1985.beaconapp.Utility.Beacon;
import vladimirpc1985.beaconapp.Utility.BeaconManager;
import vladimirpc1985.beaconapp.Utility.ScannerBeacon;
import vladimirpc1985.beaconapp.Utility.Utils;

public class MainActivity extends AppCompatActivity {
    public static final int REQUEST_ENABLE_BT = 1;
    private ScannerBeacon scannerBeacon;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        testCommunication();


        // Use this check to determine whether BLE is supported on the device. Then
        // you can selectively disable BLE-related features.
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            Utils.toast(getApplicationContext(), "BLE not supported");
            finish();
        }


        scannerBeacon = new ScannerBeacon(this, 5000, -75);
        startScan();
    }

    public static void testCommunication()
    {
        //Testing
        Log.i("Test","Starting test");
        BeaconManager manager = new BeaconManager();
        manager.addProjectBeacon(new Beacon("12345"));
    }

    public void startScan()
    {
        scannerBeacon.start();
    }

    public void stopScan()
    {
        scannerBeacon.stop();
    }

    /*
    * RSSI stands for Received Signal Strength Indicator.
    * It is the strength of the beacon's signal as seen on the receiving device.
    * The signal strength depends on distance and Broadcasting Power value.
    * At maximum Broadcasting Power (+4 dBm) the RSSI ranges from -26 (a few inches) to -100 (40-50 m distance).
    * */
    public void addDevice(BluetoothDevice device, int rssi)
    {
        String url = device.getAddress();
        ParcelUuid[] uid = device.getUuids();
        String uuid = uid.toString();
        //String name = device.getName();

        BeaconManager beaconManager = new BeaconManager();
        Beacon beacon = new Beacon(uuid, url);
        if(beaconManager.equals(beacon))
            beaconManager.addProjectBeacon(beacon);
    }
}
