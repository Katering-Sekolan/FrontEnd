import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SweatAlertDelete = async (title, message, icon) => {
  try {
    const result = await MySwal.fire({
      title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      return true; // Returning true to indicate the delete action should proceed
    } else {
      return false; // Returning false if the user canceled the delete action
    }
  } catch (error) {
    console.error("Error displaying SweetAlert:", error);
    return false;
  }
};

// ...
export default SweatAlertDelete;
