import Spinner from "./Spinner"

type props = {
    stepsArray: Array<any>,
    loading1: boolean,
    loading2: boolean,
    loading3?: boolean | null,
    values: Array<string>
}

export default ({ stepsArray, loading1, loading2, loading3, values }: props) => {
    
    console.log(values)
    return (
        <>

            <div className="modal-body">
                <div className="div">
                    <p>
                        {
                            !loading1 ? <i className={`bi ${stepsArray?.includes(1) ? `bi-check-circle-fill` : `bi-hourglass-split`}`}></i> : <Spinner />

                        }
                        {values[0]}
                    </p>
                </div>
                <div className="div">
                    <p>
                        {
                            !loading2 ? <i className={`bi ${stepsArray?.includes(2) ? `bi-check-circle-fill` : `bi-hourglass-split`}`}></i> : <Spinner />
                        }
                        {values[1]}
                    </p>
                </div>

                {values.length >= 3 &&
                    <div className="div">
                        <p>
                            {!loading3 ? <i className={`bi ${stepsArray?.includes(3) ? `bi-check-circle-fill` : `bi-hourglass-split`}`}></i> : <Spinner />}
                            {values[2]}
                        </p>

                </div>
                    }

            </div>
            {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div> */}

        </>
    )
}