herepackage com.simonium.app

import android.app.Activity
import android.os.Bundle
import android.graphics.Color
import android.view.Gravity
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(32, 32, 32, 32)
            setBackgroundColor(Color.WHITE)
        }

        val title = TextView(this).apply {
            text = "SIMONIUM"
            textSize = 32f
            setTextColor(Color.BLACK)
            gravity = Gravity.CENTER
        }

        val description = TextView(this).apply {
            text = "Scientific Information Management,\nOrganization, Network, Intelligence\nand Unified Multidisciplinary Platform"
            textSize = 16f
            setTextColor(Color.DKGRAY)
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 24)
        }

        layout.addView(title)
        layout.addView(description)

        setContentView(layout)
    }
}
