package vladimirpc1985.beaconapp.ServerAdapter;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import javax.net.ssl.HttpsURLConnection;


public class RequestAPI {

    //Sends a POST HTTP request to desired url
    //Takes in: url of endpoint, and a Map with <field, value> combinations with desired parameters
    public static String sendPostRequest(String requestURL, HashMap<String, String> postDataParams) {
        return sendRequest("POST", requestURL, postDataParams);
    }


    //Sends a PUT HTTP request to desired url (use)
    public static String sendPutRequest(String requestURL, HashMap<String, String> postDataParams) {
        return sendRequest("PUT", requestURL, postDataParams);
    }

    //Sends a DELETE HTTP request to desired url
    public static String sendDeleteRequest(String requestURL, HashMap<String, String> postDataParams) {
        return sendRequest("DELETE", requestURL, postDataParams);
    }


    //Sends a GET HTTP request to desired url address
    public static String sendGetRequest(String requestURL, HashMap<String, String> stringQueryParams){
        String response = "";
        String finalUrl = getUrlParams(requestURL, stringQueryParams);
        try {
            URL url = new URL(finalUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            int responseCode = urlConnection.getResponseCode();
            if (responseCode == HttpsURLConnection.HTTP_OK) {
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                while ((line=br.readLine()) != null) {
                    response+=line;
                }
            }
            else {
                response="";
            }
            urlConnection.disconnect();
        } catch (Exception e){
            e.printStackTrace();
        }
        return response;
    }


    //Helps generate the finial string used to pass parameters in the GET request
    //This way is cleaner than passing parameters in the headers
    private static String getUrlParams(String url, HashMap<String, String> stringQueryParam){
        String finalUrl = url + "?";
        Iterator it = stringQueryParam.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            finalUrl += pair.getKey() + "=" + pair.getValue() + "&";
            it.remove(); // avoids a ConcurrentModificationException
        }
        //Eliminates the '&' at the end or the '?' in case the params where empty
        finalUrl = finalUrl.substring(0, finalUrl.length()-1);
        return finalUrl;
    }


    //Generic Request (Doesn't include GET)
    private static String sendRequest(String verb, String requestURL, HashMap<String, String> postDataParams){
        URL url;
        String response = "";
        try {
            url = new URL(requestURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(15000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod(verb);
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            writer.write(getRequestString(postDataParams));

            writer.flush();
            writer.close();
            os.close();
            int responseCode = conn.getResponseCode();

            if (responseCode == HttpsURLConnection.HTTP_OK) {
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                while ((line=br.readLine()) != null) {
                    response+=line;
                }
            }
            else {
                response="";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }


    //This function helps parse parameters and encodes them into a String
    private static String getRequestString(HashMap<String, String> params) throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();
        boolean first = true;
        for(Map.Entry<String, String> entry : params.entrySet()){
            if (first) first = false;
            else result.append("&");
            result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
        }
        return result.toString();
    }
}