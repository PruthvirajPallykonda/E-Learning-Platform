import { useNavigate } from "react-router-dom";

function BackButton({ fallback = "/", className = "btn btn-outline-secondary mb-3" }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate(fallback);
    };

    return (
        <button type="button" className={className} onClick={handleBack}>
            Back
        </button>
    );
}

export default BackButton;
