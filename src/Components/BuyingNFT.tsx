import axios from "axios"
import { Fragment, useState } from "react"



export default () => {

    let IMAGE_UPLOADAPI = 'https://staging.everlens.io:3000/Upload'
  


 

    const [state, setState] = useState({
        name: "" as string,
        price: 0 as number,
        description: "" as string,
        nftType: "" as string,
        endDate: "" as any,
        royality: 0 as number

    })

    const handleState = (event: any) => {
        setState({
            ...state,
            [event?.target.name]: event?.target.value
        })
    }

    



    

   



    const handleMetaData = async () => {
        try {

        } catch (error) {

        }
    }






    return (
        <Fragment>
            {/* <div className="container">
                <div className="createnft">
                    <div className="nftImage m-2">
                        <div className="ImageSection" >
                            <img src={imgState} alt="" style={{ height: "150px", width: "150px" }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label"> Upload Image:-</label>
                            <input className="form-control" type="file" id="formFile" name="file" onChange={handleImage} />
                        </div>
                    </div>
                    <div className="nftDetails">
                        <div className="name m-2">
                            Name:-
                            <input type="text" name="name" id="" className="form-control" onChange={handleState} placeholder='Create NFT Name' />
                        </div>
                        <div className="price m-2">
                            Price:-
                            <input type="number" name="price" id="" className="form-control" onChange={handleState} placeholder="Enter Price" />
                        </div>
                        <div className="description m-2">
                            Description:-
                            <input type="text" name="description" id="" className="form-control" onChange={handleState} placeholder='Enter Description' />
                        </div>
                        <div className="type m-2">
                            Select NFT Type:-
                            <select className="form-select" aria-label="Default select example" name="nftType" onChange={handleState} >
                                <option selected >Select NFT Type</option>
                                <option value="1">Fixed</option>
                                <option value="2">Auction</option>
                            </select>
                        </div>
                        {state.nftType == '2' ? <div className="endDate m-2" >
                            Auction End Date:-
                            <input type="date" name="endDate" id="" className="form-control" onChange={handleState} placeholder="Enter End Date" />
                        </div> : ""}
                        <div className="royality m-2">
                            Royality:-
                            <input type="number" name="royality" id="" className="form-control" onChange={handleState} placeholder='Enter Royality' />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={uploadAllData}>Mint</button>

                </div>
            </div> */}

        </Fragment>
    )
}