function ProgressBar({ progress }) {
    if (!progress) return null;

    return (
        <div className="mb-4">
            <h5>Course Progress</h5>
            <div className="progress" style={{height: "24px"}}>
                <div 
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress.progressPercentage}%`}}    
                >
                {progress.progressPercentage}%
                </div>
            </div>

            <p className="mt-2">
                {progress.completedLessons} / {progress.totalLessons} lessons completed 
            </p>
        </div>
    );
}

export default ProgressBar;
