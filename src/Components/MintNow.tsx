import { useState } from "react"
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

const projectId = '<YOUR PROJECT ID>';
const projectSecret = '<YOUR PROJECT SECRET>';
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);




const MintNow = () => {
    const [state, setState] = useState<any>({
        name: "",
        desc: "",
        royality: ""
    })


    const handleState = (e: any) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    console.log(state);


    const [image, setImage] = useState<any>()
    console.log(image);



    const [images, setImages] = useState<{ cid: CID; path: string }[]>([]);

    let ipfs: IPFSHTTPClient | undefined;
    try {
      ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
          authorization,
        },
      });
    } catch (error) {
      console.error("IPFS error ", error);
      ipfs = undefined;
    }
  
    
    const handleFunction = async (event:any) => {
      event.preventDefault();

      const files = event.target.files[0];
  
      if (!files || files.length === 0) {
        return alert("No files selected");
      }
  
      const file = files[0];
      // upload files
      const result = await (ipfs as IPFSHTTPClient).add(file);
  
      const uniquePaths:Set<string> = new Set([
        ...images.map((image) => image.path),
        result.path,
      ]);
      const uniqueImages = [...uniquePaths.values() as any]
        .map((path) => {
          return [
            ...images,
            {
              cid: result.cid,
              path: result.path,
            },
          ].find((image) => image.path === path);
        });
  
      setImages(uniqueImages as any);
    };
  
    console.log("images ", images);
  
    return (
        <>
            <div className="container">
                <div className="img">
                    {/* <img src="" alt="image"  /> */}
                    <input type="file" name="file" id="file" onChange={handleFunction} />
                </div>
                <div className="imageshow">
                    <img src={``} alt="image" />
                </div>

                <div className="name">
                    <input type="text" name="name" id="name" className="mt-5" placeholder="Name" onChange={handleState} />
                </div>
                <div className="desc">
                    <input type="text" name="desc" id="desc" placeholder="Description" onChange={handleState} />
                </div>
                <div className="Royality">
                    <input type="number" name="royality" id="Royality" placeholder="Royality" onChange={handleState} />
                </div>

                <div className="mintnowButton">
                    <button className="btn btn-primary">Mint Now</button>
                </div>
            </div>



        </>
    )
}
export default MintNow