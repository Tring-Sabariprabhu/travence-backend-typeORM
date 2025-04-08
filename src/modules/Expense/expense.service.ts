import { Repository } from "typeorm";
import { CreateExpensesInput } from "./expense.input";
import { Expense } from "./entity/expense.entity";
import dataSource from "../../database/data-source";
import { TripMember } from "../TripMember/entity/TripMember.entity";
import { Trip } from "../Trip/entity/trip.entity";
import { setMailAndSend } from "../../helper/mailing/mailing";

export class ExpenseService{
    private ExpenseRepository: Repository<Expense>;
    private TripRepository: Repository<Trip>;
    private TripMemberRepostory: Repository<TripMember>;

    constructor(){
        this.ExpenseRepository = dataSource.getRepository(Expense);
        this.TripMemberRepostory = dataSource.getRepository(TripMember);
        this.TripRepository = dataSource.getRepository(Trip);
    }

    async createExpenses(input: CreateExpensesInput){
        try{
            const {trip_id, created_by, expenses} = input;
            const trip = await this.TripRepository.findOne({
                where: {
                    trip_id: trip_id
                },
                relations: ["created_by"]
            });
            if(!trip){
                throw new Error("Trip not found");
            }
            const trip_member = await this.TripMemberRepostory.findOne({
                where: {
                    trip_member_id: created_by
                },
                relations: ["group_member"]
            });
            if(!trip_member){
                throw new Error("You are not in Trip");
            }
            if(trip_member?.group_member?.member_id !== trip?.created_by?.member_id){
                throw new Error("Access denied! this Trip not created by you");
            }
            for(const expense of expenses){
                const {paidBy, toPay, amount} = expense;
                if(paidBy === toPay){
                    throw new Error("Same ID found");
                }
                const member_1 = await this.TripMemberRepostory.findOne({
                    where: {
                        trip_member_id: paidBy
                    },
                    relations:[
                        "group_member",
                        "group_member.user"]
                });
                if(!member_1){
                    continue;
                }
                const member_2 = await this.TripMemberRepostory.findOne({
                    where: {
                        trip_member_id: toPay
                    },
                    relations:[
                        "group_member",
                        "group_member.user"]
                });
                if(!member_2){
                    continue;
                }
                
                const expenseCreated = await this.ExpenseRepository.create({
                    amount: amount,
                    paidBy: member_1,
                    toPay: member_2,
                    trip: trip
                });
                await this.ExpenseRepository.save(expenseCreated);
                if(member_2?.group_member?.user?.email)
                setMailAndSend({
                    destinationEmail: member_2?.group_member?.user?.email,
                    subject: "Expense Remainder",
                    message: `<html>
                        <p>You have to Pay <h3>${amount}</h3> to <h3>${member_1?.group_member?.user?.name}</h3>
                        for Recent Trip ${trip?.trip_name}</h3>
                        </html> `
                })
            }
            return "Email Sent Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Creating Expenses failed " +err);
        }
    }
}