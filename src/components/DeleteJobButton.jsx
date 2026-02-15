import Swal from "sweetalert2";
import api from "../services/api";

export default function DeleteJobButton({ jobId, onDeleted }) {

    const handleDelete = async () => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this job?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/jobs/${jobId}`);

            Swal.fire("Deleted!", "Job removed successfully.", "success");

            if (onDeleted) onDeleted();

        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
            Delete
        </button>
    );
}
