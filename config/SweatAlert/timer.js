import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SweatAlertTimer = (title, message, icon) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title,
    text: message,
    icon: icon === "error" ? "error" : "success",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export default SweatAlertTimer;
