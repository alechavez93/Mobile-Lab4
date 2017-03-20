package com.example.ale.beacontracker;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.example.ale.beacontracker.Utility.Beacon;
import com.example.ale.beacontracker.Utility.BeaconManager;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        testCommunication();
    }

    public static void testCommunication(){
        //Testing
        Log.i("Test","Starting test");
        BeaconManager manager = new BeaconManager();
        manager.addProjectBeacon(new Beacon("12345"));
    }
}
