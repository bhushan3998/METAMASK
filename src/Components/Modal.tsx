import Spinner from "./Spinner"

type props = {
    signLoading: boolean,
    mintLoading: boolean,
    approveLoading: boolean
    // ref:any
}

export default (props: props) => {
    const { signLoading, mintLoading, approveLoading  } = props
    return (
        <>
            <div className="modal fade" id="exampleModal"  tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"   >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="div">
                                <h6>
                                    {
                                        mintLoading && <Spinner />
                                    }
                                    Minting
                                </h6>
                            </div>
                            <div className="div">
                                <h6>
                                    {
                                        approveLoading && <Spinner />
                                    }
                                    Check Approvel
                                </h6>
                            </div>
                            <div className="div">
                                <h6>
                                    {
                                        signLoading && <Spinner />
                                    }
                                    Signing Message
                                </h6>
                            </div>

                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}