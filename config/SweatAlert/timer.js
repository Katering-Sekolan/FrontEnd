import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SweatAlertTimer = (title, icon, timer) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: title,
    icon: icon,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export default SweatAlertTimer;
