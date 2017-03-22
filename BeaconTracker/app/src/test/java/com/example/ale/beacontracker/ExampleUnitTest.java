package com.example.ale.beacontracker;

import android.util.Log;

import com.example.ale.beacontracker.Utility.Beacon;
import com.example.ale.beacontracker.Utility.BeaconManager;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
public class ExampleUnitTest {
    @Test
    public void addition_isCorrect() throws Exception {
        BeaconManager manager = new BeaconManager();
        manager.addProjectBeacon(new Beacon("12345"));
    }
}