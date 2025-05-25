"use client"
import React from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

export default function CreationSteps({
  currentStep = 'message',
  videoData,
  onHandleInputChange,
  children
}) {
  return (
    <Card className="w-full">
      <Tabs defaultValue={currentStep} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="message">Mensagem</TabsTrigger>
          <TabsTrigger value="media">Fotos</TabsTrigger>
          <TabsTrigger value="voice">Voz</TabsTrigger>
        </TabsList>

        <CardContent>
          {children}
        </CardContent>
      </Tabs>
    </Card>
  )
}