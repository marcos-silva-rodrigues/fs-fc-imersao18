import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, PrismaClient, SpotStatus, Ticket, TicketStatus } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

type PrismaTransaction = Omit<PrismaClient, ITXClientDenyList>

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService){}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date)
      }
    })
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id }
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date)
      },
      where: { id }
    })
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id }
    })
  }

  async reserveSpot(eventId: string, dto: ReserveSpotDto) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId,
        name: {
          in: dto.spots
        }
      }
    })

    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map(spot => spot.name)
      const notFoundSpotsName = dto.spots.filter(
        spotName => !foundSpotsName.includes(spotName)
      )

      throw new Error(`Spots ${notFoundSpotsName.join(', ')} not found`)
    }

    const sportIds = spots.map(spot => spot.id);

    try {
      const tickets = await this.prismaService.$transaction(async prisma => {
        await this.createReservationHistory(prisma, sportIds, dto);
        await this.updateSpotToReversed(prisma, sportIds)
        return await this.createTickets(prisma, sportIds, dto);
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
      })

      return tickets
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch(e.code) {
          case 'P2002':
          case 'P2034':
            throw new Error('Some spots are already reserved!')
        }
      }
      throw e;
    }
  }

  private async createReservationHistory(prisma: PrismaTransaction, sportIds: string[], dto: ReserveSpotDto) {
    await prisma.reservationHistory.createMany({
      data: sportIds.map(spotId => ({
        spotId: spotId,
        ticketKind: dto.ticket_kind,
        email: dto.email,
        status: TicketStatus.reserved,
      }))
    })
  }

  private async updateSpotToReversed(prisma: PrismaTransaction, sportIds: string[]) {
    await this.prismaService.spot.updateMany({
      where: {
        id: {
          in: sportIds
        }
      },
      data: {
        status: SpotStatus.reserved
      }
    })
  }

  private async createTickets(prisma: PrismaTransaction, sportIds: string[], dto: ReserveSpotDto) {
    return await Promise.all(
      sportIds.map(spotId => {
        prisma.ticket.create({
          data: {
            spotId: spotId,
            ticketKind: dto.ticket_kind,
            email: dto.email
          }
        })
      })
    )    
  }
}
