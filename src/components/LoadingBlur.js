
import { QuestionIcon, CogIcon } from '@heroicons/react/solid'

export default function LoadingBlur({ loading }) {

    return loading ?
        <div className="absolute left-0 top-0 w-screen h-screen z-1 backdrop-blur-md flex justify-center items-center space-x-3">
            <CogIcon className='animate-spin h-12 w-12' />
            <p className="text-3xl font-light">Loading...</p>
        </div>
        :
        <></>

}