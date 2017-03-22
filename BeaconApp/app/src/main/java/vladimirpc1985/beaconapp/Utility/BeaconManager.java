package vladimirpc1985.beaconapp.Utility;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import vladimirpc1985.beaconapp.ServerAdapter.RequestAPI;

public class BeaconManager {

    private Set<Beacon> recorded;
    private String serverUrl;

    //Constructors
    public BeaconManager(){
        recorded = new HashSet<>();
        serverUrl = "http://localhost:8080/beaconTracker";
    }

    public BeaconManager(String serverUrl){
        recorded = new HashSet<>();
        this.serverUrl = serverUrl;
    }


    //Mutators
    public void addProjectBeacon(Beacon beacon){
        recorded.add(beacon);
        RequestAPI.sendPostRequest(serverUrl, beacon.getParamMap());
    }


    //Beacon Listeners with Overloaded parameters for your convenience
    public void listenToBeacon(String UUID){
        if(isBeaconInProject(UUID)){
            sendToServer(new Beacon(UUID));
        }
    }

    public void listenToBeacon(Integer UUID){
        if(isBeaconInProject(UUID)){
            sendToServer(new Beacon(Integer.toString(UUID)));
        }
    }

    public void listenToBeacon(Beacon beacon){
        if(isBeaconInProject(beacon)){
            sendToServer(beacon);
        }
    }

    //Stops listening to Beacons
    public void stopListening(Beacon beacon){
        RequestAPI.sendDeleteRequest(serverUrl, beacon.getParamMap());
    }


    //Helper functions
    private void sendToServer(Beacon beacon){
        RequestAPI.sendPutRequest(serverUrl, beacon.getParamMap());
    }

    private boolean isBeaconInProject(Object comparator){
        for(Iterator<Beacon> i=recorded.iterator(); i.hasNext();){
            Beacon b = i.next();
            if(b.equals(comparator))
                return true;
        }
        return false;
    }

}