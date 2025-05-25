"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import moment from 'moment';
import { LoaderCircle } from 'lucide-react';

export function ExperienceList() {
    const [experienceList, setExperienceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const convex = useConvex();

    useEffect(() => {
        getExperienceList();
    }, [])

    const getExperienceList = async () => {
        try {
            // Obter o ID da sessão do localStorage
            const sessionId = localStorage.getItem('sessionId');

            let result;
            if (sessionId) {
                // Buscar experiências pelo ID da sessão
                result = await convex.query(api.videoData.GetVideosBySessionId, {
                    sessionId: sessionId
                });
            } else {
                // Fallback para buscar todas as experiências
                result = await convex.query(api.videoData.GetAllVideos);
            }

            console.log(result);
            setExperienceList(result);

            // Verificar se há alguma experiência pendente
            const isPendingExperience = result?.find((item) => item.status == 1);
            if (isPendingExperience) {
                getPendingExperienceStatus(isPendingExperience);
            }
        } catch (error) {
            console.error("Erro ao buscar experiências:", error);
        } finally {
            setLoading(false);
        }
    }

    const getPendingExperienceStatus = (pendingExperience) => {
        const intervalId = setInterval(async() => {
            const result = await convex.query(api.videoData.GetVideoDataById, {
                vid: pendingExperience?._id
            });
            if(result?.status == 2){
                clearInterval(intervalId);
                console.log("Experiência gerada com sucesso!");
                getExperienceList();
            }
        }, 5000)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoaderCircle className="animate-spin mr-2" />
                <span>Carregando experiências...</span>
            </div>
        );
    }

    return (
        <div>
            {experienceList?.length === 0 ? (
                <div className='flex items-center justify-center mt-10 flex-col'>
                    <Image
                        src={'/advertisement.png'}
                        alt='experiência'
                        width={200}
                        height={200}
                    />
                    <h2 className='font-medium text-xl mt-6 text-center'>
                        Você ainda não criou nenhuma experiência para o Dia das Mães
                    </h2>
                    <Link href={'/workspace/create-experience'}>
                        <Button className='mt-5 bg-red-600 hover:bg-red-700'>
                            + Criar Nova Experiência
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
                    {experienceList?.map((experience, index) => (
                        <Link
                            key={index}
                            className='relative cursor-pointer block'
                            href={experience?.paymentStatus === "paid"
                                ? '/workspace/view-experience/'+experience?._id
                                : '/workspace/create-experience/'+experience?._id+'/unified'}
                        >
                            <div className='absolute bottom-0 p-5 w-full bg-black/80 rounded-b-xl z-10'>
                                <h2 className='text-white font-medium'>{experience?.topic}</h2>
                                <h2 className='text-white/70 text-sm'>{moment(experience?._creationTime).fromNow()}</h2>
                                {experience?.paymentStatus === "paid" ? (
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Pago</span>
                                ) : (
                                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">Pagamento Pendente</span>
                                )}
                            </div>
                            {experience?.status == 1 ? (
                                <div className='flex flex-col gap-2 items-center justify-center h-[300px] w-full bg-gray-100 rounded-lg'>
                                    <LoaderCircle className='animate-spin text-primary'/>
                                    <h2 className='text-lg'>Gerando experiência...</h2>
                                </div>
                            ) : (
                                <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
                                    {experience?.assets?.[0] ? (
                                        <Image
                                            src={experience.assets[0]}
                                            alt={experience?.topic || "Experiência"}
                                            fill
                                            className='object-cover rounded-xl'
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-xl">
                                            <span className="text-gray-500">Sem imagem</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceList
