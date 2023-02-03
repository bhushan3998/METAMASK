import Spinner from "./Spinner"

export default ({StepArray,loading1,loading2,value1,value2}: any) => {   
    return (
        <>
          
                        <div className="modal-body">
                            <div className="div">
                                <p>
                                    {
                                        loading1 ? <Spinner /> :<i className={`bi ${!loading1 ? `bi-check-circle-fill`:`bi-hourglass-split`}`}></i>

                                    }
                                    {value1}
                                </p>
                            </div>
                            <div className="div">
                                <p>
                                    {
                                     loading2 ? <Spinner /> :<i className={`bi ${loading2 ? `bi-check-circle-fill`:`bi-hourglass-split`}`}></i>
                                    }
                                    {value2}
                                </p>
                            </div>
                        
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div> */}
          
        </>
    )
}