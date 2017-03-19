/*--------------------------------------------------------------------------------------
|	Beacon Class: Created by Alejandro Chavez on 3/19/2017.
|---------------------------------------------------------------------------------------
|   Description: Encapsulates the information transmitted by a Beacon.
---------------------------------------------------------------------------------------*/

package com.example.ale.beacontracker.Utility;

import java.util.HashMap;

public class Beacon {
    private String UUID;
    private String url;

    public Beacon(String UUID) {
        this.UUID = UUID;
    }

    public Beacon(String UUID, String url) {
        this.UUID = UUID;
        this.url = url;
    }

    //Getters
    public String getUUID() { return UUID; }
    public String getUrl() { return url; }

    //Setters
    public void setUrl(String url) { this.url = url; }
    public HashMap<String, String> getParamMap(){
        HashMap<String, String> params = new HashMap<>();
        params.put("UUID",UUID);
        if(url!=null) params.put("URL", url);
        return params;
    }

    //Comparators
    public boolean equals(Beacon beacon){ return UUID.equals(beacon.getUUID()); }
    public boolean equals(String UUID){ return this.UUID.equals(UUID); }
    public boolean equals(Integer UUID){ return this.UUID.equals(Integer.toString(UUID)); }

}
