## Synopsis

This is the Neighborhood Map project for the Udacity Full Stack Web Developer Nanodegree. My app keeps track of some of my favorite places to eat in Orange, CA. The food spot markers show the hours of operation and can be filtered by type.

## Run
To run locally:

You will need to install the [XAMPP](https://www.apachefriends.org/download.html) or something similar to run a local server (I used [MAMP](https://www.mamp.info/en/downloads/)).

Once you have it installed, navigate to XAMPP/htdocs and place the **Neighborhood-Map** project folder into it. Make sure to rename the **Neighborhood-Map** project folder to "Neighborhood_Map".

Now open XAMPP and click **Manage Servers**. Then click **Configure** and set the port to "8888".

Open your browser and navigate to "http://localhost:8888/Neighborhood_Map/"

The Google Maps API will load a fullscreen map with my location markers. Clicking on a marker will display an info window with the food spot's name and weekly hours of operation. Clicking on the list to the left will also display the name and hours. The drop down menu above the list on the left provides a way to filter the list and markers by type. When an option is selected, the list and map will update to only show that type.

The sidebar can be collapsed by clicking the hamburger icon.
