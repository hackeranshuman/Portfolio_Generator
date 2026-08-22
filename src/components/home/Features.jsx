    import { Zap } from 'lucide-react';
import React from 'react'
import Title from './Title';

const Features = () => {
    const [isHover, setIsHover] = React.useState(false);
  return (
     <div id = 'features' className='flex flex-col items-center my-10 scroll-mt-12 '>
        <div className="flex items-center gap-2 text-sm text--800 bg-green-400/10 border border-indigo-200 rounded-full px-4 py-1">
        <Zap width={14}/>
            <span>Simple Process</span>
        </div>
        <Title 
            title="Build your resume" 
            description="Our streamlined process helps you to create a professional resume in minutes with intelligent AI-Powered tools and features"
        />
            <div className="flex flex-col md:flex-row items-center xl:mt-10 justify-center">
                <img className="max-w-2xl w-full xl:-ml-32" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="" />
                <div className="px-4 md:px-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                    <div className={"flex items-center justify-center gap-6 max-w-md group cursor-pointer"}>
                        <div className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300  flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-violet-600"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">AI-Powered Enhancer</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Instantly refine summaries, work experiences, and achievements with Google Gemini AI suggestions.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-green-600"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M21 12H3M12 3v18" /></svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Premium Templates</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Select between beautiful, recruiter-tested layouts and customize the color themes with a live preview.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <svg className="size-6 stroke-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">HD Multi-Format Export</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Download your resume as print-ready PDF, high-definition PNG image, plain text, or backup JSON format.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
  )
}

export default Features