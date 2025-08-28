import "./caret.scss";

const Caret = ({className, svgName}: { className?: string, svgName: string}) => {

    function displaySvg() {
        if (svgName === "next-previous-sort") {
            return <svg className={className} viewBox="0 0 164 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="caret" d="M88.1136 3.81298L161.31 91.3689C165.664 96.5771 161.961 104.5 155.173 104.5H8.20198C1.39889
                104.5 -2.29943 96.5477 2.08417 91.3451L75.8581 3.78927C79.0626 -0.013886 84.9239 -0.00254488 88.1136 3.81298Z"
                />
            </svg>
        } else if (svgName === "first-last") {
            return <svg className={className} viewBox="0 0 116 182" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="caret" d="M15.313 84.5303L102.869 11.3336C108.077 6.97949 116 10.6828 116 17.4713L116 164.442C116 171.245 108.048 174.943
                102.845 170.56L15.2893 96.7859C11.4861 93.5814 11.4975 87.7201 15.313 84.5303Z"/>
                <path className="stroke-footer-item" d="M8 17L8.00001 165" strokeWidth="15" strokeLinecap="round"/>
            </svg>
        } else if (svgName === "double") {
            return <svg viewBox="0 0 182 239" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="caret" d="M97.1136 7.81298L170.31 95.3689C174.664 100.577 170.961 108.5 164.173 108.5H17.202C10.3989
                108.5 6.70057 100.548 11.0842 95.3451L84.8581 7.78927C88.0626 3.98611 93.9239 3.99746 97.1136 7.81298Z"
                />
                <path className="caret" d="M84.1743 231.687L10.9776 144.131C6.62347 138.923 10.3267 131 17.1153 131H164.086C170.889
                131 174.587 138.952 170.204 144.155L96.4298 231.711C93.2253 235.514 87.3641 235.503 84.1743 231.687Z"
                />
            </svg>
        }

        return null;
    }

    return (
        displaySvg()
    );
};

export default Caret;