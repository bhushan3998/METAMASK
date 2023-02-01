import Spinner from "./Spinner"

type props = {
    signLoading: boolean,
    mintLoading: boolean,
    approveLoading: boolean
    spinner:boolean
    StepArray:Array<number>
    // ref:any
}

export default (props: props) => {
    const { signLoading, mintLoading, approveLoading, spinner , StepArray  } = props

    console.log(StepArray);
    

    
    return (
        <>
          
                        <div className="modal-body">
                            <div className="div">
                                <p>
                                    {
                                        StepArray.includes(1) ? <i className="bi bi-check-circle-fill"></i> : mintLoading ? <Spinner /> :<i className="bi bi-hourglass-split"></i>
                                    }
                                    Minting
                                </p>
                            </div>
                            <div className="div">
                                <p>
                                    {
                                       StepArray.includes(2) ? <i className="bi bi-check-circle-fill"></i> : approveLoading ? <Spinner /> :<i className="bi bi-hourglass-split"></i>
                                    }
                                    Check Approvel
                                </p>
                            </div>
                            <div className="div">
                                <p>
                                    {
                                        StepArray.includes(3) ? <i className="bi bi-check-circle-fill"></i> : signLoading ? <Spinner /> :<i className="bi bi-hourglass-split"></i>
                                    }
                                    Signing Message
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