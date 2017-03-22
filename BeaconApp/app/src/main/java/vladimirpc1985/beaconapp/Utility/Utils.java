package vladimirpc1985.beaconapp.Utility;

import android.content.Context;
import android.widget.Toast;
import android.view.Gravity;



public class Utils {

    public static void toast(Context context, String string) {
        Toast toast = Toast.makeText(context, string, Toast.LENGTH_SHORT);
        toast.setGravity(Gravity.CENTER | Gravity.BOTTOM, 0, 0);
        toast.show();
    }
}
