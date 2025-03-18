import { useState ,useEffect,useRef, ReactElement} from 'react'

type HelloProps = {testing1:number, testing2?: string ,children :ReactElement ,onCallback? : (value: number)=> void }
function HelloWorld( { testing1 = 4 ,testing2 = "GBT",children,onCallback}:HelloProps ):ReactElement
{

    const [count, setCount] = useState(0)
    const h1Ref = useRef<HTMLHeadingElement| null>(null)

    useEffect(() => {
        //const connection = createConnection(serverUrl, roomId);
       // connection.connect();

        if ( h1Ref.current !==  undefined && onCallback !==undefined){
            console.log("IT IS FOUND");
            setCount(count + 1);

            onCallback(count + 1);
        }
        return () => {
           // connection.disconnect();
        };
    }, [h1Ref]);

    return (
        <>
            <div>
                <h1 ref={h1Ref}>TESTING {testing1} testing2: {testing2}</h1>
                {children}
            </div>

        </>
    )
}

export default HelloWorld
