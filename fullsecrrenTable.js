//Full screen table view
var elem = document.getElementById("myDashboard");
function openFullscreen() {
    if (elem?.requestFullscreen) {
        elem.requestFullscreen();
        document.getElementById('myDashboard').style.backgroundColor = "#f7f7f7";
        document.getElementById("myDashboard").style.overflow = 'auto'

    } else if (elem?.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
        document.getElementById('myDashboard').style.backgroundColor = "#f7f7f7";
        document.getElementById("myDashboard").style.overflow = 'auto'

    } else if (elem?.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
        document.getElementById('myDashboard').style.backgroundColor = "#f7f7f7";
        document.getElementById("myDashboard").style.overflow = 'auto'
    }
}

return (

    <div>
        <button onClick={() => openFullscreen()}><i class="fa fa-th" aria-hidden="true"></i></button>


        <div className="row" id="myDashboard">
//Table
        </div>
    </div>
)