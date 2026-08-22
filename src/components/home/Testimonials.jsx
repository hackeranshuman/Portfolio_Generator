import React from 'react'
import Title from './Title'
import { BookUserIcon } from 'lucide-react'

const CreateCard = ({ card }) => {
    return (
        <div className="min-w-[280px] mx-3 p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
                <img
                    src={card.image}
                    alt={card.name}
                    className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                    <h3 className="font-medium text-slate-700">
                        {card.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                        {card.handle}
                    </p>
                </div>
            </div>
        </div>
    )
}

const Testimonials = () => {
    const cardsData = [
        {
            image: 'https://plus.unsplash.com/premium_photo-1668485966810-cbd0f685f58f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Aanchal Garg',
            handle: '@aanchalgarg0107',
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Anurag Singh',
            handle: '@_anurag0412',
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Anuj Rathore',
            handle: '@anujrathore011',
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Anmol Agrwal',
            handle: '@_agarwalz',
        },
    ]

    return (
        <div
            id="testimonials"
            className="flex flex-col items-center my-10 scroll-mt-12"
        >
            <div className="flex items-center gap-2 text-sm text-slate-800 bg-green-400/10 border border-indigo-200 rounded-full px-4 py-1">
                <BookUserIcon className="size-4.5 stroke-green-600" />
                <span>Testimonials</span>
            </div>

            <Title
                title="Don't just take our words"
                description="Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review."
            />

            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .marquee-inner {
                    animation: marqueeScroll 25s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>
        </div>
    )
}

export default Testimonials
