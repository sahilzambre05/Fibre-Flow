package com.paper.gradechange.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class GradeChangeRequestDTO {

    @NotNull(message = "currentGrade is required")
    @Positive(message = "currentGrade must be greater than 0")
    private Double currentGrade;

    @NotNull(message = "targetGrade is required")
    @Positive(message = "targetGrade must be greater than 0")
    private Double targetGrade;

    @NotNull(message = "basisWeight is required")
    @Positive(message = "basisWeight must be greater than 0")
    private Double basisWeight;

    @NotNull(message = "stockFlow is required")
    @Positive(message = "stockFlow must be greater than 0")
    private Double stockFlow;

    @NotNull(message = "steamPressure is required")
    @Positive(message = "steamPressure must be greater than 0")
    private Double steamPressure;

    @NotNull(message = "machineSpeed is required")
    @Positive(message = "machineSpeed must be greater than 0")
    private Double machineSpeed;

    @NotNull(message = "moisture is required")
    @Positive(message = "moisture must be greater than 0")
    private Double moisture;

    @NotNull(message = "ash is required")
    @Positive(message = "ash must be greater than 0")
    private Double ash;

    @NotNull(message = "fillerFlow is required")
    @Positive(message = "fillerFlow must be greater than 0")
    private Double fillerFlow;

    public GradeChangeRequestDTO() {}

    public GradeChangeRequestDTO(Double currentGrade, Double targetGrade, Double basisWeight, Double stockFlow,
                                 Double steamPressure, Double machineSpeed, Double moisture, Double ash, Double fillerFlow) {
        this.currentGrade = currentGrade;
        this.targetGrade = targetGrade;
        this.basisWeight = basisWeight;
        this.stockFlow = stockFlow;
        this.steamPressure = steamPressure;
        this.machineSpeed = machineSpeed;
        this.moisture = moisture;
        this.ash = ash;
        this.fillerFlow = fillerFlow;
    }

    public Double getCurrentGrade() { return currentGrade; }
    public void setCurrentGrade(Double currentGrade) { this.currentGrade = currentGrade; }

    public Double getTargetGrade() { return targetGrade; }
    public void setTargetGrade(Double targetGrade) { this.targetGrade = targetGrade; }

    public Double getBasisWeight() { return basisWeight; }
    public void setBasisWeight(Double basisWeight) { this.basisWeight = basisWeight; }

    public Double getStockFlow() { return stockFlow; }
    public void setStockFlow(Double stockFlow) { this.stockFlow = stockFlow; }

    public Double getSteamPressure() { return steamPressure; }
    public void setSteamPressure(Double steamPressure) { this.steamPressure = steamPressure; }

    public Double getMachineSpeed() { return machineSpeed; }
    public void setMachineSpeed(Double machineSpeed) { this.machineSpeed = machineSpeed; }

    public Double getMoisture() { return moisture; }
    public void setMoisture(Double moisture) { this.moisture = moisture; }

    public Double getAsh() { return ash; }
    public void setAsh(Double ash) { this.ash = ash; }

    public Double getFillerFlow() { return fillerFlow; }
    public void setFillerFlow(Double fillerFlow) { this.fillerFlow = fillerFlow; }
}
